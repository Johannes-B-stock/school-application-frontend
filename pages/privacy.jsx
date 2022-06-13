import ReactMarkdown from "react-markdown";
import { API_URL } from "../config";

export default function PrivacyPage({ privacy }) {
  return (
    <div className="content">
      <ReactMarkdown>{privacy.attributes.content}</ReactMarkdown>
    </div>
  );
}

export async function getStaticProps({ locale }) {
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
}
