import { PageContentData } from "lib/pageContent";
import { createContext, useState, useEffect, useMemo } from "react";
import { NEXT_URL } from "../config";

interface IPageContentContext {
  pageContent: PageContentData;
  triggerSetPageContent: (locale: string) => Promise<void>;
}

const PageContentContext = createContext<IPageContentContext>(
  {} as IPageContentContext
);

export const PageContentProvider = ({ children, locale }) => {
  const [pageContent, setPageContent] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const triggerSetPageContent = async (locale: string) => {
    try {
      const res = await fetch(`${NEXT_URL}/api/page-content?locale=${locale}`);
      const data = await res.json();
      if (res.ok) {
        setPageContent(data.pageContent);
      } else {
        setPageContent(null);
      }
    } catch (error) {
      console.log(error.message ?? error);
    } finally {
      setLoadingInitial(false);
    }
  };

  useMemo(() => {
    triggerSetPageContent(locale);
  }, [locale]);

  return (
    <PageContentContext.Provider value={{ pageContent, triggerSetPageContent }}>
      {!loadingInitial && children}
    </PageContentContext.Provider>
  );
};

export default PageContentContext;
