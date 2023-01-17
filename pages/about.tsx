import ReactMarkdown from "react-markdown";
import { API_URL } from "../config";
import { toast } from "react-toastify";
import NotAuthorized from "@/components/auth/NotAuthorized";
import { GetStaticProps } from "next";
import { ApiError, SingleDataResponse } from "api-definitions/strapiBaseTypes";
import { AboutPage } from "api-definitions/backend";

export default function About({
  about,
  error,
}: {
  about: AboutPage;
  error: ApiError;
}) {
  if (error) {
    if (error.status === 403) {
      return <NotAuthorized />;
    }
    toast.error(error.message);
  }
  return (
    <div className="content">
      {about && <ReactMarkdown>{about.content}</ReactMarkdown>}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const aboutFetch = await fetch(`${API_URL}/api/about-page?locale=${locale}`);

  let error = null;
  const aboutResult =
    (await aboutFetch.json()) as SingleDataResponse<AboutPage>;

  if (!aboutFetch.ok) {
    error = aboutResult.error;
  }

  return {
    props: {
      about: aboutResult.data ?? null,
      error: error,
    },
    revalidate: 1,
  };
};
