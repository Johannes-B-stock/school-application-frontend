import GoogleSpinner from "@/components/common/GoogleSpinner";
import { useContext, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { parseCookie } from "lib/utils";
import { toast } from "react-toastify";
import qs from "qs";
import NotAuthorized from "@/components/auth/NotAuthorized";
import { GetServerSideProps } from "next";
import {
  createApplication,
  getStaffApplicationSettings,
} from "lib/staffApplication";
import AuthContext from "@/context/AuthContext";

export default function CreateStaffApplicationPage({
  token,
}: {
  token: string;
}) {
  const [state, setState] = useState("Preparing...");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useMemo(() => {
    const createApplicationAsync = async () => {
      if (!token || !user) {
        return;
      }
      try {
        setIsLoading(true);
        setState("Creating new staff application...");
        const query = qs.stringify({
          populate: ["applicationQuestions"],
        });
        const staffAppDetails = await getStaffApplicationSettings({
          token,
          query,
        });
        console.log(staffAppDetails);
        const questionCollection = staffAppDetails.data?.applicationQuestions;
        if (!questionCollection) {
          throw new Error(
            "Question collection could not be found for staff applications"
          );
        }
        const staffApplication = await createApplication(
          user?.id,
          questionCollection?.id
        );
        router.push(`/staff-application/${staffApplication.id}`);
      } catch (error: any) {
        setState("Application creation failed");
        toast.error(
          "Staff Application creation failed because " + error.message ?? error
        );
        setTimeout(() => router.push("/"), 3000);
      } finally {
        setIsLoading(false);
      }
    };
    if (router && token) {
      createApplicationAsync();
    } else {
      setState("Creation Not Possible");
    }
  }, [router, token, user]);

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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { token } = parseCookie(req);

  return { props: { token: token ?? null } };
};
