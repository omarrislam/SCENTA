import { useEffect } from "react";

const useMeta = (title: string, description?: string) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    if (description) {
      const meta = document.querySelector("meta[name='description']");
      if (meta) {
        meta.setAttribute("content", description);
      }
    }
  }, [title, description]);
};

export default useMeta;
