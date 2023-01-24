import { API_URL, NEXT_URL } from "../config";
import axios from "axios";
import qs from "qs";
import { SingleDataResponse } from "api-definitions/strapiBaseTypes";
import { Question, School, SchoolApplication } from "api-definitions/backend";
import { getQuestionsFromAPI } from "./questions";
import { createAnswer } from "./answers";

export async function getApplicationDetails(
  id: string,
  token: string,
  queryObject: object
) {
  const query = qs.stringify(queryObject, { encodeValuesOnly: true });

  const result = await axios.get<SingleDataResponse<SchoolApplication>>(
    `${API_URL}/api/school-applications/${id}?${query}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data;
}

export async function createApplication(school: School, userId: number) {
  const application = await axios.post<SchoolApplication>(
    `${NEXT_URL}/api/application/create-school-application`,
    {
      questionCollectionId: school.applicationQuestions?.id,
      userId,
      schoolId: school.id,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return application.data;
}

// export async function createApplication(
//   school: School,
//   userId: number,
//   token: string
// ) {
//   const query = qs.stringify(
//     {
//       filters: {
//         collection: {
//           id: {
//             $eq: school.applicationQuestions?.id,
//           },
//         },
//       },
//     },
//     {
//       encodeValuesOnly: true,
//     }
//   );
//   const questionsResult = await getQuestionsFromAPI(token, query);
//   const questions = questionsResult.data ?? [];

//   const res = await axios.post<SingleDataResponse<SchoolApplication>>(
//     `${API_URL}/api/school-applications`,
//     {
//       data: {
//         school: school.id,
//         user: userId,
//       },
//     },
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
//   const application = res.data?.data;
//   if (!application || res.status !== 200) {
//     throw new Error(
//       res.data?.error?.message ?? res.statusText ?? "Something went wrong."
//     );
//   } else {
//     await Promise.all(
//       questions?.map(async (question) => {
//         await createAnswer(question, application, "", token);
//       })
//     );
//   }
//   return application;
// }
