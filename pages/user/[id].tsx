import { parseCookie } from "lib/utils";
import { ApiError, getUser } from "lib/user";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import ProfileCard from "@/components/user/ProfileCard";
import { User } from "api-definitions/backend";
import { GetServerSideProps } from "next";
import NotAuthorized from "@/components/auth/NotAuthorized";
import NotFound from "@/components/common/NotFound";
import ServerError from "@/components/common/ServerError";
import { AxiosError } from "axios";

export default function UserView({
  user,
  error,
}: {
  user?: User;
  error?: any;
}) {
  if (!user || error) {
    if (error?.status === 403) {
      return <NotAuthorized />;
    }
    if (error?.status === 404) {
      return <NotFound />;
    }

    return <ServerError errorMessage={error?.message ?? error} />;
  }

  return (
    <section className="section has-background-link-light">
      <div className="level is-centered has-text-centered ">
        <div className="level-item p-5">
          <ProfileCard user={user} />
        </div>
      </div>
    </section>
  );
}

UserView.getLayout = function getLayout(page: any) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const id = typeof params?.id === "string" ? params?.id : params?.id?.[0];
  const { token } = parseCookie(req);

  if (!id) {
    throw new Error("No user id given");
  }

  try {
    const user = await getUser(+id, token, ["picture", "role"]);
    return { props: { user, error: null } };
  } catch (error: any) {
    let status = 500;
    let message = error?.message ?? error;
    if (error instanceof AxiosError) {
      status = error.response?.status ?? 500;
      message = error.message;
    }
    if (error instanceof ApiError) {
      status = error.status;
      message = error.message;
    }
    return { props: { user: null, error: { status, message } } };
  }
};
