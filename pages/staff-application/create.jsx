import GoogleSpinner from "@/components/common/GoogleSpinner";
import { useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { API_URL } from "@/config/index";
import { parseCookie } from "@/helpers/index";
import { toast } from "react-toastify";
import qs from "qs";
import NotAuthorized from "@/components/auth/NotAuthorized";

export default function CreateStaffApplicationPage({ token }) {
  const [state, setState] = useState("Preparing...");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useMemo(() => {
    const createApplicationAsync = async () => {
      if (!token) {
        return;
      }
      try {
        setState("Load questions");
        const query = qs.stringify({
          populate: ["questions"],
        });
        const staffAppDetails = await axios.get(
          `${API_URL}/api/staff-application-setting?${query}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(staffAppDetails);
        const questionCollection =
          staffAppDetails.data.data.attributes.questions.data;

        const questionQuery = qs.stringify({
          populate: ["type"],
          filters: {
            collection: {
              id: {
                $eq: questionCollection.id,
              },
            },
          },
        });
        const questions = await axios.get(
          `${API_URL}/api/questions?${questionQuery}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(questions);
        setState("Creating Questions for Application...");

        const questionIds = questions.data.data.map((question) => question.id);

        const answers = await Promise.all(
          questionIds.map(async (questionId) => {
            const answerRes = await axios.post(
              `${API_URL}/api/answers`,
              {
                data: {
                  question: questionId,
                  answer: "",
                },
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            return answerRes.data;
          })
        );

        console.log(answers);
        const answerIds = answers.map((answer) => answer.data.id);
        setState("Creating basic Application...");
        const staffApplication = await axios.post(
          `${API_URL}/api/staff-applications`,
          {
            data: {
              answers: answerIds,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(staffApplication);
        toast.success("Application Successfully created!");
        router.push(`/staff-application/${staffApplication.data.data.id}`);
      } catch (error) {
        setState("Application creation failed");
        toast.error(
          "Staff Application creation failed because " + error.message ?? error
        );
        setTimeout(() => router.push("/"), 3000);
      }
    };
    if (router && token) {
      setIsLoading(true);
      createApplicationAsync();
      setIsLoading(false);
    } else {
      setState("Creation Not Possible");
    }
  }, [token, router]);

  if (!token) {
    return <NotAuthorized />;
  }

  return (
    <section className="section has-text-centered">
      <h1 className="title mb-6 pb-6">Create staff application</h1>
      {isLoading && <GoogleSpinner />}
      <h4 className="subtitle is-4 mt-5">{state}</h4>
    </section>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = parseCookie(req);

  return { props: { token: token ?? null } };
}
