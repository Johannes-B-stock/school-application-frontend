import qs from "qs";
import { API_URL, NEXT_URL } from "@/config/index";
import axios from "axios";
import {
  SchoolApplication,
  Reference,
  User,
  StaffApplication,
  School,
} from "api-definitions/backend";
import { SingleDataResponse } from "api-definitions/strapiBaseTypes";
import { getStaffApplicationSettings } from "./staffApplication";

export async function submitReference(referenceId: number, uid: string) {
  const updateResult = await axios.put<SingleDataResponse<Reference>>(
    `${API_URL}/api/references/${referenceId}?uid=${uid}`,
    {
      data: {
        submitted: true,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!updateResult.data || updateResult.data.error) {
    throw new Error(
      updateResult.data?.error?.message ?? updateResult.statusText
    );
  }
}

export async function sendReference(
  application: StaffApplication | SchoolApplication,
  reference: Partial<Reference>,
  user: User
) {
  const newReference = await axios.post<Reference>(
    `${NEXT_URL}/api/references/send-reference`,
    {
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

export async function addReferenceToApplication(
  application: SchoolApplication | StaffApplication,
  token: string,
  referenceId: number
) {
  const table = "school" in application ? "school" : "staff";
  const addReferenceToApplicationFetch = await fetch(
    `${API_URL}/api/${table}-applications/${application.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          references: [
            ...(application.references?.map((ref) => ref.id) ?? []),
            referenceId,
          ],
        },
      }),
    }
  );
  if (!addReferenceToApplicationFetch.ok) {
    const errorResult = await addReferenceToApplicationFetch.json();
    throw new Error(
      errorResult.error?.message ?? addReferenceToApplicationFetch.statusText
    );
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
  const staffApplicationSetting = await getStaffApplicationSettings({
    token,
    query,
  });
  return staffApplicationSetting.data?.referenceQuestions?.id;
}
