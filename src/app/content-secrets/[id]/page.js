import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Clock, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/app/Footer/Footer";
import { getPosts, getArticleById as getCmsArticleById } from "@/lib/cms/posts";
import { resolveImageUrl } from "@/lib/sanity";
import { ARTICLES } from "../articles";
import ArticleFadeIn from "../ArticleFadeIn";

export const revalidate = 3600; // revalidate every 1 hour (ISR)

async function getArticle(id) {
  // Check static ARTICLES first
  const staticArticle = ARTICLES.find((art) => art.id === id);
  if (staticArticle) {
    return {
      id: staticArticle.id,
      title: staticArticle.title,
      category: staticArticle.category,
      date: staticArticle.date,
      readTime: staticArticle.readTime,
      image: staticArticle.image,
      description: staticArticle.description,
      intro: staticArticle.intro,
      content: staticArticle.content || [],
      publishedAt: "2026-06-25T00:00:00.000Z",
      updatedAt: "2026-06-25T00:00:00.000Z",
      author: { name: "Rabt Team" }
    };
  }

  // Otherwise, fetch from Sanity
  const matched = await getCmsArticleById(id);
  if (matched) {
    return {
      id: matched.slug || matched._id,
      title: matched.title,
      category: matched.category,
      date: matched.date,
      readTime: matched.readTime,
      image: resolveImageUrl(matched.image),
      description: matched.description,
      intro: matched.intro,
      content: matched.content || [],
      publishedAt: matched.publishedAt || matched._createdAt || "2026-06-25T00:00:00.000Z",
      updatedAt: matched.updatedAt || matched._updatedAt || matched.publishedAt || "2026-06-25T00:00:00.000Z",
      author: matched.author || { name: "Rabt Team" }
    };
  }
  return null;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const article = await getArticle(id);
  
  if (!article) {
    return {
      title: "Article Not Found | Rabt Content Secrets",
    };
  }

  return {
    title: `${article.title} | Rabt Content Secrets`,
    description: article.description,
    alternates: {
      canonical: `https://rabt.com/content-secrets/${id}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `https://rabt.com/content-secrets/${id}`,
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author?.name || "Rabt Team"],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [article.image],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getPosts();
  const cmsIds = posts.map((post) => ({
    id: post.slug || post._id,
  }));
  const staticIds = ARTICLES.map((post) => ({
    id: post.id,
  }));
  return [...staticIds, ...cmsIds];
}

export default async function ArticlePage({ params }) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#050507] text-[#f8fafc] font-sans pt-28 md:pt-36 flex flex-col items-center justify-center gap-4">
        <Navbar />
        <div className="text-neutral-500 uppercase tracking-widest text-xs">Article not found</div>
        <Link href="/content-secrets" className="text-xs font-bold tracking-widest uppercase text-sky-400 hover:text-white transition duration-200">
          Back to Feed
        </Link>
      </div>
    );
  }

  // Fetch Related Articles
  const allPosts = await getPosts();
  const localFormatted = ARTICLES.map((post) => ({
    id: post.id,
    title: post.title,
    category: post.category,
    date: post.date,
    readTime: post.readTime,
    image: post.image,
    description: post.description,
  }));
  const cmsFormatted = allPosts.map((post) => ({
    id: post.slug || post._id,
    title: post.title,
    category: post.category,
    date: post.date,
    readTime: post.readTime,
    image: resolveImageUrl(post.image),
    description: post.description,
  }));
  const combined = [...localFormatted, ...cmsFormatted];
  const related = combined.filter((art) => art.id !== id).slice(0, 3);

  // Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.description,
    "image": article.image,
    "author": {
      "@type": "Person",
      "name": article.author?.name || "Rabt Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Rabt",
      "logo": {
        "@type": "ImageObject",
        "url": "https://rabt.com/logo.png"
      }
    },
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt || article.publishedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://rabt.com/content-secrets/${id}`
    }
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://rabt.com" },
      { "@type": "ListItem", "position": 2, "name": "Content Secrets", "item": "https://rabt.com/content-secrets" },
      { "@type": "ListItem", "position": 3, "name": article.title, "item": `https://rabt.com/content-secrets/${id}` }
    ]
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#f8fafc] font-sans selection:bg-neutral-800 pt-28 md:pt-36">
      <Navbar />
      
      {/* Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <main className="mx-auto max-w-7xl px-6 py-12 md:py-20 md:px-12">
        <ArticleFadeIn>
          <article>
            {/* Back Link */}
            <Link
              href="/content-secrets"
              className="group mb-8 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-neutral-400 hover:text-white transition duration-200"
            >
              <ChevronLeft size={16} className="transform transition-transform duration-200 group-hover:-translate-x-1" />
              Back to Feed
            </Link>

            {/* Hero Section Cover Image */}
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-white/5 bg-neutral-900 mb-8">
              <Image
                src={article.image}
                alt={article.title}
                fill
                priority={true}
                className="object-cover"
              />
            </div>

            <header>
              {/* Category & Breadcrumbs */}
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-neutral-500 mb-4">
                <span>Content Secrets</span>
                <span>/</span>
                <span className="text-sky-400 font-semibold">{article.category}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] mb-6 font-sans">
                {article.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-500 uppercase tracking-widest border-b border-white/10 pb-6 mb-8">
                <address className="not-italic">
                  By {article.author?.name || "Rabt Team"}
                </address>
                <span className="text-neutral-700">•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  <time dateTime={article.publishedAt}>{article.date}</time>
                </div>
                <span className="text-neutral-700">•</span>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </header>

            {/* Article Introduction */}
            <div className="text-lg sm:text-xl font-medium text-neutral-200 leading-relaxed border-l-2 border-sky-400 pl-6 mb-10">
              {article.intro}
            </div>

            {/* Typography System Body Text */}
            <section className="space-y-8 text-neutral-300 text-base sm:text-lg leading-relaxed font-normal">
              {article.content.map((block, index) => {
                if (block.type === "heading") {
                  return (
                    <h2
                      key={index}
                      className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-12 mb-4 leading-snug"
                    >
                      {block.text}
                    </h2>
                  );
                }
                return (
                  <p key={index} className="mt-4">
                    {block.text}
                  </p>
                );
              })}
            </section>
          </article>

          {/* Related Articles */}
          {related.length > 0 && (
            <section className="mt-20 border-t border-white/10 pt-12">
              <h2 className="text-2xl font-black tracking-tight text-white mb-8">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((art) => (
                  <Link
                    key={art.id}
                    href={`/content-secrets/${art.id}`}
                    className="group flex flex-col gap-3 rounded-xl border border-white/5 bg-[#0b0b0e] p-4 transition-all duration-300 hover:border-white/10"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-neutral-900">
                      <Image
                        src={art.image}
                        alt={art.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold tracking-widest text-sky-400 uppercase">
                        {art.category}
                      </span>
                      <h3 className="text-base font-bold text-white tracking-tight mt-1 line-clamp-2 group-hover:text-sky-400 transition-colors">
                        {art.title}
                      </h3>
                      <p className="text-xs text-neutral-400 line-clamp-2 mt-2 leading-relaxed">
                        {art.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </ArticleFadeIn>
      </main>
      <Footer />
    </div>
  );
}
