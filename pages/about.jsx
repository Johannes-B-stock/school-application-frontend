import Layout from "@/components/Layout";
import getPageContent from "lib/pageContent";

export default function About({ pageContent }) {
  return (
    <Layout pageContent={pageContent}>
      <h1>About this page</h1>
    </Layout>
  );
}

export async function getStaticProps() {
  const pageContent = await getPageContent();
  return {
    props: { pageContent },
  };
}
