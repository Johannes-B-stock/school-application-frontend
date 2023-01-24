import { API_URL } from "@/config/index";
import { Question, StaffApplication } from "api-definitions/backend";
import {
  ArrayDataResponse,
  SingleDataResponse,
} from "api-definitions/strapiBaseTypes";
import axios from "axios";
import { createAnswer } from "lib/answers";
import { getQuestionsFromAPI } from "lib/questions";
import { parseCookie } from "lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import qs from "qs";

export default async function createStaffApplication(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
    return;
  }

  const { questionCollectionId, userId } = req.body;
  const { token } = parseCookie(req);
  if (!token) {
    res.status(403).json({ message: "Not logged in" });
    return;
  }

  const query = qs.stringify(
    {
      filters: {
        collection: {
          id: {
            $eq: questionCollectionId,
          },
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  const applicationResult = await axios.post<
    SingleDataResponse<StaffApplication>
  >(
    `${API_URL}/api/staff-applications`,
    {
      data: {
        user: userId,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const application = applicationResult.data?.data;
  if (!application || applicationResult.status !== 200) {
    res.status(400);
    res.write({
      error:
        applicationResult.data?.error?.message ??
        applicationResult.statusText ??
        "Application could not be created.",
    });
    return;
  } else {
    let questionsResult: ArrayDataResponse<Question> | undefined = undefined;
    try {
      questionsResult = await getQuestionsFromAPI(token, query);
      const questions = questionsResult.data ?? [];

      await Promise.all(
        questions?.map(async (question) => {
          await createAnswer(question, application, "", token, "staff");
        })
      );
    } catch (error: any) {
      console.log(error);
      res.status(400);
      res.write({
        error:
          questionsResult?.error?.message ??
          error?.message ??
          "Questions for application could not be created.",
      });
    }
  }
  res.status(200).json(application);
}
