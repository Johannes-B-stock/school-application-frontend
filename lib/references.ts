import qs from "qs";
import { API_URL, NEXT_URL } from "@/config/index";
import axios from "axios";
import {
  SchoolApplication,
  Reference,
  StaffApplicationSetting,
  User,
  StaffApplication,
  School,
} from "api-definitions/backend";
import { SingleDataResponse } from "api-definitions/strapiBaseTypes";

export async function sendReference(
  referenceName: string,
  application: StaffApplication | SchoolApplication,
  reference: Partial<Reference>,
  user: User
) {
  const newReference = await axios.post<Reference>(
    `${NEXT_URL}/api/references/send-reference`,
    {
      referenceName,
      application,
      reference,
      user,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return newReference.data;
}

export async function updateReferenceInSchoolApplication(
  application: SchoolApplication,
  token: string,
  referenceName: string,
  result: any
) {
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

export async function updateReferenceInStaffApplication(
  application: StaffApplication,
  token: string,
  referenceName: string,
  result: any
) {
  const addReferenceToApplicationFetch = await fetch(
    `${API_URL}/api/staff-applications/${application.id}`,
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

export async function getQuestionCollectionIdFromSchool(
  application: SchoolApplication,
  token: string
): Promise<number | undefined> {
  const schoolQuery = qs.stringify({
    populate: ["referenceQuestions"],
  });
  const schoolFetch = await fetch(
    `${API_URL}/api/schools/${application.school.id}?${schoolQuery}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const schoolJson = (await schoolFetch.json()) as SingleDataResponse<School>;

  if (!schoolFetch.ok) {
    throw new Error(schoolJson.error?.message ?? schoolFetch.statusText);
  }

  return schoolJson.data?.referenceQuestions?.id;
}

export async function getReferenceAnswers(referenceId: number, token: string) {
  const query = qs.stringify({
    populate: {
      answers: {
        populate: {
          question: {
            sort: ["order:asc"],
            populate: ["type.localizations", "localizations"],
          },
        },
      },
    },
  });
  const referencesResult = await axios.get<SingleDataResponse<Reference>>(
    `${API_URL}/api/references/${referenceId}?${query}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return referencesResult.data.data?.answers;
}

export async function getQuestionCollectionIdFromStaffApplication(
  token: string
): Promise<number | undefined> {
  const query = qs.stringify(
    {
      populate: ["referenceQuestions"],
    },
    { encodeValuesOnly: true }
  );
  const staffApplicationSetting = await axios.get<
    SingleDataResponse<StaffApplicationSetting>
  >(`${API_URL}/api/staff-application-setting?${query}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return staffApplicationSetting.data.data?.referenceQuestions?.id;
}
