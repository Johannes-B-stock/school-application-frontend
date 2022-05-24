import { v4 as uuidv4 } from "uuid";
import qs from "qs";
import { API_URL, NEXT_URL } from "@/config/index";

export async function sendReference(
  referenceName,
  application,
  reference,
  user,
  token
) {
  let schoolQuery = qs.stringify({
    populate: ["referenceQuestions"],
  });

  const schoolFetch = await fetch(
    `${API_URL}/api/schools/${application.school.data.id}?${schoolQuery}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const schoolJson = await schoolFetch.json();

  if (!schoolFetch.ok) {
    throw new Error(schoolJson.error?.message ?? schoolFetch.statusText);
  }

  const referenceQuestionCollectionId =
    schoolJson.data.attributes.referenceQuestions.data.id;

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

  const questionsJson = await questionsFetch.json();

  if (!questionsFetch.ok) {
    throw new Error(questionsJson.error?.message ?? questionsFetch.statusText);
  }

  const questions = questionsJson.data;
  const answerIds = [];
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
        applicant: user.username,
        uid: uid,
        url: `${NEXT_URL}/references/${uid}`,
        answers: answerIds,
      },
    }),
  });

  const result = await updateEmailSendFetch.json();
  if (!updateEmailSendFetch.ok) {
    throw new Error(result.error?.message ?? updateEmailSendFetch.statusText);
  }
  const addReferenceToApplicationFetch = await fetch(
    `${API_URL}/api/school-applications/${application.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          [referenceName]: result.data.id,
        },
      }),
    }
  );
  if (!addReferenceToApplicationFetch.ok) {
    const errorResult = await addReferenceToApplicationFetch.json();

    throw new Error(errorResult.error.message);
  }
}
