import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getStaticPage } from "../../services/contentService";
import useMeta from "../../app/seo/useMeta";
import { pickLocalized, resolveLocale } from "../../utils/localize";
import Spinner from "../../components/feedback/Spinner";

const StaticPage = () => {
  const { t, i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
  const { slug } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["page", slug],
    queryFn: () => getStaticPage(slug ?? "")
  });
  const title = data ? pickLocalized(data.title, data.titleAr, locale) : "";
  useMeta(`${title ? `${title} - ` : ""}SCENTA`);

  if (isLoading) {
    return <Spinner />;
  }

  if (!data) {
    return <div className="card">{t("page.loading")}</div>;
  }

  const body = pickLocalized(data.body, data.bodyAr, locale);

  return (
    <div className="card">
      <h1 className="section-title">{title}</h1>
      <p>{body}</p>
    </div>
  );
};

export default StaticPage;
