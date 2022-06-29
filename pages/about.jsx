import ReactMarkdown from "react-markdown";
import Layout from "@/components/Layout/Layout";
import { API_URL } from "../config";
import { toast } from "react-toastify";
import NotAuthorized from "@/components/auth/NotAuthorized";

export default function About({ about, error }) {
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

export async function getStaticProps({ locale }) {
  const aboutFetch = await fetch(`${API_URL}/api/about-page?locale=${locale}`);

  let error = null;
  const aboutResult = await aboutFetch.json();

  if (!aboutFetch.ok) {
    error = aboutResult.error;
  }

  return {
    props: {
      about: aboutResult.data?.attributes ?? null,
      error: error,
    },
    revalidate: 1,
  };
}
