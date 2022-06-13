import ReactMarkdown from "react-markdown";
import { API_URL } from "../config";

export default function ImprintPage({ imprint }) {
  return (
    <div className="content">
      <ReactMarkdown>{imprint.attributes.content}</ReactMarkdown>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  const imprintFetch = await fetch(`${API_URL}/api/impressum?locale=${locale}`);

  const imprintResult = await imprintFetch.json();

  if (!imprintFetch.ok) {
    throw new Error(imprintResult.error?.message ?? imprintFetch.statusText);
  }

  return {
    props: {
      imprint: imprintResult.data,
    },
    revalidate: 1,
  };
}
