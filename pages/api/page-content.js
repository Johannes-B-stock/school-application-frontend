import getPageContent from "lib/pageContent";

export default async function pageContent(req, res) {
  if (req.method === "GET") {
    const pageContent = (await getPageContent()) ?? pageContentDefault;

    res.status(200).json({ pageContent });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

const pageContentDefault = {
  showcaseTitle: "Welcome to the school application page",
  showcaseSubtitle:
    "Here you can apply for schools and manage your registered schools",
  contact:
    "Please contact us if you have any questions. We will try to answer as soon as possible.",
  facebookLink: "",
  twitterLink: "",
  instagramLink: "",
  brandImage:
    "https://res.cloudinary.com/johnny-boy/image/upload/v1650448727/thumbnail_university_d8f6c86ddb.png",
  showcase:
    "https://res.cloudinary.com/johnny-boy/image/upload/v1649361607/large_showcase_85ca7afc73.png",
};
