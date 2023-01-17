import {
  Question,
  Reference,
  SchoolApplication,
  StaffApplication,
  User,
} from "api-definitions/backend";
import { v4 as uuidv4 } from "uuid";
import qs from "qs";
import { NextApiRequest, NextApiResponse } from "next";
import { parseCookie } from "lib/utils";
import { API_URL, NEXT_URL } from "@/config/index";
import {
  ArrayDataResponse,
  SingleDataResponse,
} from "api-definitions/strapiBaseTypes";
import {
  getQuestionCollectionIdFromSchool,
  getQuestionCollectionIdFromStaffApplication,
  updateReferenceInSchoolApplication,
  updateReferenceInStaffApplication,
} from "lib/references";

export default async function sendReference(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.headers.cookie) {
    res.status(403).json({ message: "Not authorized" });
    return;
  }
  const { token } = parseCookie(req);
  if (!token) {
    res.status(403).json({ message: "Not logged in" });
    return;
  }

  if (req.method === "POST") {
    const {
      referenceName,
      application,
      reference,
      user,
    }: {
      referenceName: string;
      application: StaffApplication | SchoolApplication;
      reference: Partial<Reference>;
      user: Partial<User>;
    } = req.body;
    const isSchoolReference = "school" in application;

    const referenceQuestionCollectionId = isSchoolReference
      ? await getQuestionCollectionIdFromSchool(application, token)
      : await getQuestionCollectionIdFromStaffApplication(token);

    const questionQuery = qs.stringify(
      {
        filters: {
          collection: {
            id: {
              $eq: referenceQuestionCollectionId,
            },
          },
        },
      },
      { encodeValuesOnly: true }
    );
    const questionsFetch = await fetch(
      `${API_URL}/api/questions?${questionQuery}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const questionsResponse =
      (await questionsFetch.json()) as ArrayDataResponse<Question>;

    if (!questionsFetch.ok) {
      throw new Error(
        questionsResponse.error?.message ?? questionsFetch.statusText
      );
    }

    const questions = questionsResponse.data;
    const answerIds: number[] = [];
    if (questions) {
      await Promise.all(
        questions.map(async (question) => {
          const createAnswerFetch = await fetch(`${API_URL}/api/answers`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              data: {
                answer: "",
                question: question.id,
              },
            }),
          });

          const fetchResult = await createAnswerFetch.json();

          answerIds.push(fetchResult.data.id);
        })
      );
    }

    const uid = uuidv4();
    const updateEmailSendFetch = await fetch(`${API_URL}/api/references`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          name: reference.name,
          relation: reference.relation,
          email: reference.email,
          applicant: `${user.firstname} ${user.lastname}`,
          uid: uid,
          url: `${NEXT_URL}/references/${uid}`,
          answers: answerIds,
        },
      }),
    });
    const result =
      (await updateEmailSendFetch.json()) as SingleDataResponse<Reference>;
    console.log(result);

    if (!updateEmailSendFetch.ok || result.error) {
      res.status(400);
      res.write({
        error: result.error?.message ?? updateEmailSendFetch.statusText,
      });
      return;
    }
    if (!result.data) {
      res.status(404);
      res.write("Not Found");
      return;
    }
    if (isSchoolReference) {
      await updateReferenceInSchoolApplication(
        application,
        token,
        referenceName,
        result
      );
    } else {
      await updateReferenceInStaffApplication(
        application,
        token,
        referenceName,
        result
      );
    }

    res.status(200).json(result.data);
  }
}
