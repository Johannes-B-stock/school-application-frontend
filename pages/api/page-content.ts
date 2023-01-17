import { PageContentData } from "api-definitions/backend";
import { Image } from "api-definitions/strapiBaseTypes";
import getPageContent from "lib/pageContent";
import { parseCookie } from "lib/utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function pageContent(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    let locale =
      typeof req.query.locale === "string"
        ? req.query.locale
        : req.query.locale[0];
    if (!locale) {
      locale = parseCookie(req).NEXT_LOCALE ?? "en";
    }
    const pageContent = (await getPageContent(locale)) ?? pageContentDefault;
    res.status(200).json({ pageContent });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

const pageContentDefault: PageContentData = {
  id: 1,
  createdAt: "01-01-1999",
  updatedAt: "01-01-1999",
  showcaseTitle: "Welcome to the school application page",
  showcaseSubtitle:
    "Here you can apply for schools and manage your registered schools",
  contact:
    "Please contact us if you have any questions. We will try to answer as soon as possible.",
  facebookLink: "",
  twitterLink: "",
  instagramLink: "",
  navbar_brand: {
    id: 1,
    formats: {
      thumbnail: {
        url: "https://res.cloudinary.com/johnny-boy/image/upload/v1650448727/thumbnail_university_d8f6c86ddb.png",
      },
    },
  } as Image,

  showcase: {
    id: 2,
    formats: {
      thumbnail: {
        url: "https://res.cloudinary.com/johnny-boy/image/upload/v1649361607/large_showcase_85ca7afc73.png",
      },
      large: {
        url: "https://res.cloudinary.com/johnny-boy/image/upload/v1649361607/large_showcase_85ca7afc73.png",
      },
    },
  } as Image,
};
