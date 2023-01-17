import ReactMarkdown from "react-markdown";
import { API_URL } from "../config";
import { GetStaticProps } from "next";
import { Privacy } from "api-definitions/backend";

export default function PrivacyPage({ privacy }: { privacy: Privacy }) {
  return (
    <div className="content">
      <ReactMarkdown>{privacy.content}</ReactMarkdown>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const privacyFetch = await fetch(`${API_URL}/api/privacy?locale=${locale}`);

  const privacyResult = await privacyFetch.json();

  if (!privacyFetch.ok) {
    throw new Error(privacyResult.error?.message ?? privacyFetch.statusText);
  }

  return {
    props: {
      privacy: privacyResult.data,
    },
    revalidate: 1,
  };
};
