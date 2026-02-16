import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getBlogPost, listBlogPosts } from "../../services/contentService";
import { resolveResponsiveImageSource } from "../../services/api";
import useMeta from "../../app/seo/useMeta";
import { pickLocalized, resolveLocale } from "../../utils/localize";
import Spinner from "../../components/feedback/Spinner";

const BlogPage = () => {
  const { t, i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
  const { slug } = useParams();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog"],
    queryFn: listBlogPosts
  });

  const { data: post } = useQuery({
    queryKey: ["blog", slug],
    queryFn: () => getBlogPost(slug ?? ""),
    enabled: Boolean(slug)
  });

  const title = post ? pickLocalized(post.title, post.titleAr, locale) : t("nav.blog");
  useMeta(title);

  if (isLoading) {
    return <Spinner />;
  }

  if (slug && post) {
    return (
      <div className="card">
        <h1 className="section-title">{title}</h1>
        <p>{pickLocalized(post.body, post.bodyAr, locale)}</p>
      </div>
    );
  }

  return (
    <div className="grid">
      <h1 className="section-title">{t("nav.blog")}</h1>
      {posts.length ? (
        <div className="grid grid--2">
          {posts.map((item) => (
            <Link key={item.id} to={`/blog/${item.slug}`} className="card blog-card">
              {(() => {
                const imageSource = resolveResponsiveImageSource(item.cover);
                if (!imageSource?.src) return null;
                return (
                <div className="blog-card__media">
                  <img
                    src={imageSource.src}
                    srcSet={imageSource.srcSet}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    fetchpriority="low"
                    sizes="(max-width: 900px) 100vw, 50vw"
                  />
                </div>
                );
              })()}
              <strong>{pickLocalized(item.title, item.titleAr, locale)}</strong>
              <p>{pickLocalized(item.excerpt, item.excerptAr, locale)}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card empty-state">
          <div className="empty-state__icon" aria-hidden="true">journal</div>
          <h2 className="empty-state__title">{t("blog.empty")}</h2>
          <p className="empty-state__body">{t("home.newsletterBody")}</p>
          <div className="empty-state__actions">
            <Link className="button button--primary" to="/shop">
              {t("cta.explore")}
            </Link>
            <Link className="button button--outline" to="/">
              {t("brand")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
