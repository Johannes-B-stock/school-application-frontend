import Layout from "@/components/Layout/Layout";
import ServerError from "@/components/common/ServerError";

export default function ServerErrorPage() {
  return <ServerError />;
}

ServerErrorPage.getLayout = function getLayout(page: any) {
  return <Layout title="500 - Server Error">{page}</Layout>;
};
