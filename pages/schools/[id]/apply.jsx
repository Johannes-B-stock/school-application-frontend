import Link from "next/link";
import { useRouter } from "next/router";
import qs from "qs";
import { API_URL } from "@/config/index";
import Layout from "@/components/Layout";
import { useState } from "react";
import cookie from "cookie";
import styles from "@/styles/Form.module.css";
import { toast } from "react-toastify";

export default function ApplyPage({ school, questions, token }) {
  const [answers, setAnswers] = useState(
    questions.map((q) => ({ ...q, answer: "" }))
  );

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
      router.push(`/applications/${application.data.id}`);
    }
  };

  const onAnswered = (e) => {
    const updatedAnswer = answers.find(
      (answer) => answer.id.toString() === e.target.name
    );
    const index = answers.indexOf(updatedAnswer);
    updatedAnswer.answer = e.target.value;
    const newAnswers = [...answers];
    newAnswers[index] = { ...newAnswers[index], answer: e.target.value };
    setAnswers(newAnswers);
  };

  return (
    <Layout>
      <div className="content">
        <h1>Apply for School {school?.name}</h1>
        <p>Do you really want to apply for the school {school?.name}?</p>
        <p>
          You have to pay an application fee of {school?.applicationFee}&euro;
          for the application to be processed.
        </p>
        <p>
          Further details about the school can be found
          <Link href={`/schools/${school?.id}`}> here</Link>
        </p>
        <form className={`form ${styles.form}`} onSubmit={handleSubmit}>
          {questions?.map((question) => (
            <div key={question.id} className="field">
              <label htmlFor={question.id} className="label">
                {question.question}
              </label>
              <div className="control">
                <input
                  type="text"
                  name={question.id}
                  className="input"
                  value={
                    answers.find((answer) => answer.id === question.id).answer
                  }
                  onChange={onAnswered}
                />
              </div>
            </div>
          ))}

          <div className="field is-grouped">
            <div className="control">
              <button type="submit" className="button">
                Start Application
              </button>
            </div>
            <div className="control">
              <Link href="/">
                <a className="button">Cancel</a>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params: { id }, req }) {
  const query = qs.stringify({
    populate: "question_collection",
  });

  if (!req.headers.cookie) {
    res.status(403).json({ message: "Not authorized" });
    return;
  }
  const { token } = cookie.parse(req.headers.cookie);
  console.log(token);
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
  const questionQuery = qs.stringify(
    {
      filters: {
        collection: {
          id: {
            $eq: school.question_collection.data.id,
          },
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  );
  const quesRes = await fetch(
    `${API_URL}/api/application-questions?${questionQuery}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const questionResult = await quesRes.json();
  const questions =
    questionResult.data?.map((data) => ({
      id: data.id,
      ...data.attributes,
    })) ?? null;
  return {
    props: { school, questions, token },
  };
}
