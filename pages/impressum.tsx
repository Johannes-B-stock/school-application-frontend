import { Imprint } from "api-definitions/backend";
import { GetStaticProps } from "next";
import ReactMarkdown from "react-markdown";
import { API_URL } from "../config";

export default function ImprintPage({ imprint }: { imprint: Imprint }) {
  return (
    <div className="content">
      <ReactMarkdown>{imprint.content}</ReactMarkdown>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
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
};
