import Link from "next/link";
import { useRouter } from "next/router";
import qs from "qs";
import { API_URL } from "@/config/index";
import Layout from "@/components/Layout";
import cookie from "cookie";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";

export default function ApplyPage({ school, questions, token }) {
  const answers = questions.map((q) => ({ ...q, answer: "" }));

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/api/school-applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          school: school.id,
        },
      }),
    });
    const application = await res.json();
    if (!res.ok) {
      toast.error(
        application.error?.message ?? res.statusText ?? "Something went wrong."
      );
    } else {
      await Promise.all(
        answers.map(async (answer) => {
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

          if (answerRes.ok) {
            console.log(answerResult);
          } else {
            toast.error(answerResult.error?.message ?? answerRes.statusText);
          }
        })
      );

      router.push(`/applications/${application.data.id}`);
    }
  };

  return (
    <Layout>
      <div className="content">
        <ReactMarkdown>{school?.preApplicationText}</ReactMarkdown>
        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit is-primary"
              className="button"
              onClick={handleSubmit}
            >
              Start Application
            </button>
          </div>
          <div className="control">
            <Link href="/">
              <a className="button">Cancel</a>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params: { id }, req }) {
  const query = qs.stringify({
    populate: "applicationQuestions",
  });

  if (!req.headers.cookie) {
    res.status(403).json({ message: "Not authorized" });
    return;
  }
  const { token } = cookie.parse(req.headers.cookie);
  const res = await fetch(`${API_URL}/api/schools/${id}?${query}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await res.json();
  const school = {
    id: result.data.id,
    ...result.data.attributes,
  };
  console.log(school);
  const questionQuery = qs.stringify(
    {
      filters: {
        collection: {
          id: {
            $eq: school.applicationQuestions.data.id,
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
  const questionResult = await quesRes.json();
  console.log(questionResult);
  const questions =
    questionResult.data?.map((data) => ({
      id: data.id,
      ...data.attributes,
    })) ?? null;
  return {
    props: { school, questions, token },
  };
}
