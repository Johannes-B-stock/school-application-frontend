import { useRouter } from "next/router";
import qs from "qs";
import { API_URL } from "@/config/index";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import { MouseEvent, useContext, useState } from "react";
import { parseCookie } from "lib/utils";
import NotAuthorized from "@/components/auth/NotAuthorized";
import {
  ArrayDataResponse,
  SingleDataResponse,
} from "api-definitions/strapiBaseTypes";
import { Question, School } from "api-definitions/backend";
import { GetServerSideProps } from "next";
import AuthContext from "@/context/AuthContext";

export default function ApplyPage({
  school,
  questions,
  token,
}: {
  school: School;
  questions: Question[];
  token: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const router = useRouter();

  const handleSubmit = async (e: MouseEvent) => {
    try {
      e.preventDefault();
      if (isLoading || !user) {
        return;
      }
      setIsLoading(true);

      const res = await fetch(`${API_URL}/api/school-applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            school: school.id,
            user: user.id,
          },
        }),
      });
      const application = await res.json();
      if (!res.ok) {
        toast.error(
          application.error?.message ??
            res.statusText ??
            "Something went wrong."
        );
      } else {
        const answers = questions?.map((q) => ({ ...q, answer: "" }));
        await Promise.all(
          answers?.map(async (answer) => {
            const answerRes = await fetch(`${API_URL}/api/answers`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                data: {
                  school_application: application.data.id,
                  question: answer.id,
                  answer: answer.answer,
                },
              }),
            });
            const answerResult = await answerRes.json();

            if (!answerRes.ok) {
              toast.error(answerResult.error?.message ?? answerRes.statusText);
            }
          })
        );

        router.push(`/applications/${application.data.id}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return token ? (
    <div className="content">
      <ReactMarkdown>{school?.preApplicationText}</ReactMarkdown>
      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={`button is-primary ${
              isLoading && "is-loading is-disabled"
            }`}
            onClick={handleSubmit}
          >
            Start Application
          </button>
        </div>
        <div className="control">
          <a className="button" onClick={() => router.back()}>
            Cancel
          </a>
        </div>
      </div>
    </div>
  ) : (
    <NotAuthorized />
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  res,
}) => {
  const id = params?.id;
  if (!req.headers.cookie) {
    res.statusCode = 403;
    res.write(JSON.stringify({ message: "Not authorized" }));
    return { props: { school: null } };
  }
  const query = qs.stringify({
    populate: "applicationQuestions",
  });

  const { token } = parseCookie(req);
  const resultFetch = await fetch(`${API_URL}/api/schools/${id}?${query}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = (await resultFetch.json()) as SingleDataResponse<School>;
  const school = result.data;

  if (!resultFetch.ok) {
    throw new Error("School could not be found");
  }
  const questionQuery = qs.stringify(
    {
      filters: {
        collection: {
          id: {
            $eq: result.data?.applicationQuestions?.id,
          },
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  );
  const quesRes = await fetch(`${API_URL}/api/questions?${questionQuery}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const questionResult = (await quesRes.json()) as ArrayDataResponse<Question>;
  const questions = questionResult.data;
  return {
    props: {
      school: school ?? null,
      questions: questions ?? null,
      token,
    },
  };
};
