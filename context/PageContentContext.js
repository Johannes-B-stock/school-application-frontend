import { useRouter } from "next/router";
import { createContext, useState, useEffect } from "react";
import { NEXT_URL } from "../config";

const PageContentContext = createContext();

export const PageContentProvider = ({ children }) => {
  const [pageContent, setPageContent] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const router = useRouter();

  useEffect(() => {
    getPageContent();
  }, []);

  const getPageContent = async () => {
    try {
      const res = await fetch(`${NEXT_URL}/api/page-content`);
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
    <PageContentContext.Provider value={{ pageContent }}>
      {!loadingInitial && children}
    </PageContentContext.Provider>
  );
};

export default PageContentContext;
