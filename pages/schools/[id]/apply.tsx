import { useRouter } from "next/router";
import qs from "qs";
import { API_URL } from "@/config/index";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import { MouseEvent, useContext, useState } from "react";
import {
  ArrayDataResponse,
  SingleDataResponse,
} from "api-definitions/strapiBaseTypes";
import { School } from "api-definitions/backend";
import { GetStaticPaths, GetStaticProps } from "next";
import AuthContext from "@/context/AuthContext";
import { createApplication } from "lib/schoolApplication";
import axios from "axios";

export default function ApplyPage({ school }: { school: School }) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const router = useRouter();

  const handleSubmit = async (e: MouseEvent) => {
    try {
      e.preventDefault();
      if (isLoading || !user) {
        return;
      }
      setIsLoading(true);
      const application = await createApplication(school, user.id);
      if (application) {
        router.push(`/applications/${application.id}`);
      }
    } catch (error: any) {
      toast.error(error?.message ?? error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="content">
      <ReactMarkdown>{school?.preApplicationText}</ReactMarkdown>
      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={`button is-primary ${
              isLoading && "is-loading is-disabled"
            }`}
            onClick={handleSubmit}
          >
            Start Application
          </button>
        </div>
        <div className="control">
          <a className="button" onClick={() => router.back()}>
            Cancel
          </a>
        </div>
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const query = qs.stringify(
    {
      populate: "applicationQuestions",
      filters: {
        $and: [
          {
            isPublic: {
              $eq: true,
            },
            acceptingStudents: {
              $eq: true,
            },
          },
        ],
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  const schoolsResult = await axios.get<ArrayDataResponse<School>>(
    `${API_URL}/api/schools?${query}`
  );

  const schools = schoolsResult.data?.data;

  const paths =
    schools?.map((school) => ({
      params: { id: school.id.toString() },
    })) ?? [];

  // { fallback: blocking } means if path does not exists it behaves like ssr
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id;

  // if (!req.headers.cookie) {
  //   res.statusCode = 403;
  //   res.write(JSON.stringify({ message: "Not authorized" }));
  //   return { notFound: true };
  // }
  const query = qs.stringify({
    populate: "applicationQuestions",
  });

  const schoolResult = await axios.get<SingleDataResponse<School>>(
    `${API_URL}/api/schools/${id}?${query}`
  );

  const school = schoolResult.data?.data;

  if (!school) {
    return { notFound: true };
  }
  return {
    props: {
      school: school ?? null,
    },
  };
};
