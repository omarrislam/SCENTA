import { fetchApi } from "./api";
import {
  getBlogPost as getMockBlogPost,
  getStaticPage as getMockStaticPage,
  listBlogPosts as listMockBlogPosts
} from "./mockApi";
import { BlogPost, StaticPage } from "./types";

const hasApi = Boolean(import.meta.env.VITE_API_BASE_URL);

interface BackendBlogPost {
  _id: string;
  slug: string;
  title: string;
  titleAr?: string;
  excerpt?: string;
  excerptAr?: string;
  body?: string;
  bodyAr?: string;
  cover?: string;
  content?: string;
  featuredImage?: string;
}

interface BackendPage {
  _id: string;
  slug: string;
  title: string;
  titleAr?: string;
  body?: string;
  bodyAr?: string;
  content?: string;
}

const mapBlogPost = (post: BackendBlogPost): BlogPost => ({
  id: post._id,
  slug: post.slug,
  title: post.title,
  titleAr: post.titleAr,
  excerpt: post.excerpt ?? "",
  excerptAr: post.excerptAr,
  body: post.body ?? post.content ?? "",
  bodyAr: post.bodyAr,
  cover: post.cover ?? post.featuredImage ?? ""
});

const mapPage = (page: BackendPage): StaticPage => ({
  id: page._id,
  slug: page.slug,
  title: page.title,
  titleAr: page.titleAr,
  body: page.body ?? page.content ?? "",
  bodyAr: page.bodyAr
});

export const listBlogPosts = async (): Promise<BlogPost[]> => {
  if (!hasApi) {
    return listMockBlogPosts();
  }
  try {
    const posts = await fetchApi<BackendBlogPost[]>("/content/blog");
    if (!posts.length) {
      return listMockBlogPosts();
    }
    return posts.map(mapBlogPost);
  } catch {
    return listMockBlogPosts();
  }
};

export const getBlogPost = async (slug: string): Promise<BlogPost> => {
  if (!hasApi) {
    return getMockBlogPost(slug);
  }
  try {
    const post = await fetchApi<BackendBlogPost>(`/content/blog/${slug}`);
    return post ? mapBlogPost(post) : getMockBlogPost(slug);
  } catch {
    return getMockBlogPost(slug);
  }
};

export const getStaticPage = async (slug: string): Promise<StaticPage> => {
  if (!hasApi) {
    return getMockStaticPage(slug);
  }
  try {
    const page = await fetchApi<BackendPage>(`/content/pages/${slug}`);
    return page ? mapPage(page) : getMockStaticPage(slug);
  } catch {
    return getMockStaticPage(slug);
  }
};
