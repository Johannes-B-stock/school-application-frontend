import { createContext, useState, useEffect } from "react";
import { NEXT_URL } from "../config";

const PageContentContext = createContext();

export const PageContentProvider = ({ children, locale }) => {
  const [pageContent, setPageContent] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  useEffect(() => {
    triggerSetPageContent(locale);
  }, [locale]);

  const triggerSetPageContent = async (locale) => {
    try {
      const res = await fetch(`${NEXT_URL}/api/page-content?locale=${locale}`);
      const data = await res.json();
      if (res.ok) {
        setPageContent(data.pageContent);
      } else {
        setPageContent(null);
      }
    } finally {
      setLoadingInitial(false);
    }
  };

  return (
    <PageContentContext.Provider value={{ pageContent, triggerSetPageContent }}>
      {!loadingInitial && children}
    </PageContentContext.Provider>
  );
};

export default PageContentContext;
