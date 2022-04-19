import Link from "next/link";
import { useRouter } from "next/router";
import qs from "qs";
import { API_URL } from "@/config/index";
import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import styles from "@/styles/Form.module.css";
import { parseCookie } from "@/helpers/index";
import { toast } from "react-toastify";

export default function ApplicationPage({ application, error }) {
  const router = useRouter();

  useEffect(() => {
    if (error) {
      toast.error(`${error.status} - ${error.message}`);
      // router.back();
    }
  }, [router, error]);
  const [answers, setAnswers] = useState(
    application.answers.data?.map((q) => ({ ...q, answer: "" }))
  );
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
        <h1>
          Application for School {application?.school.data.attributes.name}
        </h1>
        <p>
          This is your application for the school{" "}
          {application?.school.data.attributes.name}?
        </p>
        <p>
          You have to pay an application fee of{" "}
          {application?.school.data.attributes.applicationFee}&euro; for the
          application to be processed.
        </p>
        <p>
          Further details about the school can be found
          <Link href={`/schools/${application?.school.data.attributes.id}`}>
            <a> here</a>
          </Link>
        </p>
        <form className={`form ${styles.form}`}>
          {application.answers.data?.map((answer) => (
            <div key={answer.id} className="field">
              <label htmlFor={answer.id} className="label">
                {answer.question}
              </label>
              <div className="control">
                <input
                  type="text"
                  name={answer.id}
                  className="input"
                  value={
                    answers.find((answer) => answer.id === answer.id).answer
                  }
                  onChange={onAnswered}
                />
              </div>
            </div>
          ))}

          <div className="field is-grouped">
            <div className="control">
              <button type="submit" className="button">
                Update
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
    populate: ["answers", "school"],
  });

  const { token } = parseCookie(req);

  const res = await fetch(`${API_URL}/api/school-applications/${id}?${query}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await res.json();
  if (!res.ok) {
    return {
      props: {
        error: result.error,
      },
    };
  }
  const application = {
    id: result.data.id,
    ...result.data.attributes,
  };

  return {
    props: { application },
  };
}
