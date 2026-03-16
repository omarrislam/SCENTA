import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getStaticPage } from "../../services/contentService";
import useMeta from "../../app/seo/useMeta";
import Spinner from "../../components/feedback/Spinner";

const StaticPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["page", slug],
    queryFn: () => getStaticPage(slug ?? "")
  });
  useMeta(`${data?.title ? `${data.title} - ` : ""}SCENTA`);

  if (isLoading) return <Spinner />;
  if (!data) return <div className="card">{t("page.loading")}</div>;

  return (
    <div className="card">
      <h1 className="section-title">{data.title}</h1>
      <p>{data.body}</p>
    </div>
  );
};

export default StaticPage;
