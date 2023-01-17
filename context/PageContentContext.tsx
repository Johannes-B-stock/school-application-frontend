import { PageContentData } from "api-definitions/backend";
import { createContext, useState, useEffect } from "react";
import { Locales, NEXT_URL } from "../config";

interface IPageContentContext {
  pageContent?: PageContentData;
  triggerSetPageContent: (locale: Locales) => Promise<void>;
}

const PageContentContext = createContext<IPageContentContext>(
  {} as IPageContentContext
);

export const PageContentProvider = ({
  children,
  locale,
}: {
  children: any;
  locale: Locales;
}) => {
  const [pageContent, setPageContent] = useState<PageContentData | undefined>(
    undefined
  );
  const [loadingInitial, setLoadingInitial] = useState(true);

  const triggerSetPageContent = async (newLocale: Locales) => {
    try {
      const data = await fetchPageContentFromNextBackend(newLocale);
      setPageContent(data.pageContent);
    } catch (error: any) {
      setPageContent(undefined);
      console.log(error.message ?? error);
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    triggerSetPageContent(locale);
  }, [locale]);

  return (
    <PageContentContext.Provider value={{ pageContent, triggerSetPageContent }}>
      {!loadingInitial && children}
    </PageContentContext.Provider>
  );
};

export default PageContentContext;

async function fetchPageContentFromNextBackend(newLocale: Locales) {
  const res = await fetch(`${NEXT_URL}/api/page-content?locale=${newLocale}`);
  if (!res.ok) {
    throw new Error("Page Content could not be fetched");
  }
  const data = (await res.json()) as { pageContent: PageContentData };
  return data;
}
