import Layout from "@/components/Layout/Layout";
import NotFound from "@/components/common/NotFound";

export default function NotFoundPage() {
  return <NotFound />;
}

NotFoundPage.getLayout = function getLayout(page: any) {
  return <Layout title="Page not Found">{page}</Layout>;
};
