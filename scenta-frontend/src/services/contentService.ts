import { fetchApi, resolveApiAssetUrl } from "./api";
import { BlogPost, StaticPage } from "./types";

interface BackendBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  body?: string;
  cover?: string;
  featuredImage?: string;
}

interface BackendPage {
  id: string;
  slug: string;
  title: string;
  body?: string;
}

const mapBlogPost = (post: BackendBlogPost): BlogPost => ({
  id: post.id,
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt ?? "",
  body: post.body ?? "",
  cover: resolveApiAssetUrl(post.cover ?? post.featuredImage ?? "") ?? ""
});

const mapPage = (page: BackendPage): StaticPage => ({
  id: page.id,
  slug: page.slug,
  title: page.title,
  body: page.body ?? ""
});

const localeParam = () => {
  // Reads the current i18n language if available, falls back to "en"
  const lang =
    typeof document !== "undefined"
      ? (document.documentElement.lang ?? "en")
      : "en";
  return lang.startsWith("ar") ? "ar" : "en";
};

export const listBlogPosts = async (): Promise<BlogPost[]> => {
  const posts = await fetchApi<BackendBlogPost[]>(`/content/blog?locale=${localeParam()}`);
  return posts.map(mapBlogPost);
};

export const getBlogPost = async (slug: string): Promise<BlogPost> => {
  const post = await fetchApi<BackendBlogPost>(`/content/blog/${slug}?locale=${localeParam()}`);
  return mapBlogPost(post);
};

export const getStaticPage = async (slug: string): Promise<StaticPage> => {
  const page = await fetchApi<BackendPage>(`/content/pages/${slug}?locale=${localeParam()}`);
  return mapPage(page);
};
