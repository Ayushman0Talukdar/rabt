import Link from "next/link";
import { getPosts } from "@/lib/cms/posts";
import { resolveImageUrl } from "@/lib/sanity";
import { ARTICLES } from "./articles";
import Masonry from "./Masonry";
import Grainient from "@/components/ui/Grainient";
import Navbar from "@/components/Navbar";
import Footer from "@/app/Footer/Footer";

export const metadata = {
  title: "Content Secrets | Rabt Blog — Video Editing & Marketing Tips",
  description: "Expert tips on video editing, content strategy, and brand growth from the Rabt team. New articles posted weekly.",
  alternates: {
    canonical: "https://rabt.com/content-secrets",
  },
};

export default async function ContentSecrets({ searchParams }) {
  const posts = await getPosts();
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const ITEMS_PER_PAGE = 30;

  // Format static articles as fallback
  const localFormatted = ARTICLES.map((post, idx) => ({
    ...post,
    img: post.image,
    height: [400, 320, 480][idx % 3],
  }));

  let postsList = localFormatted;
  if (posts && posts.length > 0) {
    postsList = posts.map((post, idx) => ({
      id: post.slug || post._id,
      title: post.title,
      category: post.category,
      date: post.date,
      readTime: post.readTime,
      img: resolveImageUrl(post.image),
      image: resolveImageUrl(post.image),
      description: post.description,
      intro: post.intro,
      content: post.content || [],
      height: [450, 380, 520, 340][idx % 4],
    }));
  }

  const totalPages = Math.ceil(postsList.length / ITEMS_PER_PAGE);
  const displayedPosts = postsList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      {/* Background Grainient */}
      <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none opacity-25">
        <Grainient
          color1="#050507"
          color2="#0055ff"
          color3="#ffffff"
          timeSpeed={0.15}
          grainAmount={0.05}
        />
      </div>

      <div className="min-h-screen bg-transparent text-[#f8fafc] font-sans selection:bg-neutral-800 pt-28 md:pt-36">
        <Navbar />

        {/* Main Content Area */}
        <main className="mx-auto max-w-7xl px-6 py-12 md:py-20 md:px-12 flex flex-col gap-12 sm:gap-16">
          {/* Instagram Profile Style Page Header */}
          <header className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16 py-8 px-4 border-b border-white/5">
            {/* Left Col: Profile Pic */}
            <div className="flex-shrink-0">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-black border border-white/10 flex items-center justify-center shadow-2xl select-none">
                <span className="font-serif text-3xl md:text-5xl font-black tracking-tighter text-white">
                  rabt.
                </span>
              </div>
            </div>

            {/* Right Col: Profile Info */}
            <div className="flex-grow text-center md:text-left">
              {/* Username row */}
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
                  Content Secrets
                  <span className="inline-flex items-center justify-center bg-[#0095f6] text-white rounded-full w-4.5 h-4.5 text-[8px] font-black select-none">
                    ✓
                  </span>
                </h1>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-neutral-500">•</span>
                  <svg className="w-6 h-6 text-neutral-300 hover:text-white cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="6" cy="12" r="2" />
                    <circle cx="18" cy="12" r="2" />
                  </svg>
                </div>
              </div>

              {/* Slogan */}
              <div className="text-xs md:text-sm font-semibold tracking-wider text-neutral-300 uppercase mt-1">
                RABT ™ | WHERE VISION BECOMES REALITY
              </div>

              {/* Stats row */}
              <div className="flex items-center justify-center md:justify-start gap-6 md:gap-8 mt-4 mb-3 text-sm md:text-base">
                <span>
                  <strong className="text-white font-bold">{postsList.length}</strong>{" "}
                  <span className="text-neutral-400">posts</span>
                </span>
                <span>
                  <strong className="text-white font-bold">44k</strong>{" "}
                  <span className="text-neutral-400">followers</span>
                </span>
                <span>
                  <strong className="text-white font-bold">4</strong>{" "}
                  <span className="text-neutral-400">following</span>
                </span>
              </div>

              {/* Category */}
              <div className="text-xs md:text-sm text-neutral-400 font-medium">
                Editorial / Production Studio
              </div>

              {/* Bio details */}
              <div className="text-sm md:text-base text-neutral-200 mt-2 space-y-1 font-normal leading-relaxed">
                <p>The editing secrets behind 20,000+ viral videos. Curated by the Rabt Editorial Team.</p>
                <p className="text-neutral-400 text-xs md:text-sm">Branding • Content • Ads • Digital Presence</p>
                <p className="text-sky-400 hover:underline cursor-pointer text-xs md:text-sm flex items-center justify-center md:justify-start gap-1 mt-1">
                  <span>📅</span> Book a free strategy audit ... <span className="text-neutral-500 hover:text-white">more</span>
                </p>
              </div>
            </div>
          </header>

          {/* Masonry Feed */}
          {postsList.length > 0 && (
            <>
              <Masonry
                items={displayedPosts}
                ease="power3.out"
                duration={0.7}
                stagger={0.06}
                animateFrom="bottom"
                scaleOnHover={true}
                hoverScale={0.97}
                blurToFocus={true}
                colorShiftOnHover={false}
              />

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <nav aria-label="Blog pagination" className="flex justify-center items-center gap-6 mt-12 pt-8 border-t border-white/5">
                  {currentPage > 1 ? (
                    <Link
                      href={`/content-secrets?page=${currentPage - 1}`}
                      className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium transition-all duration-300 hover:bg-white/10 hover:border-white/20 text-neutral-300 hover:text-white"
                    >
                      Previous
                    </Link>
                  ) : (
                    <span className="px-5 py-2.5 rounded-full border border-white/5 bg-white/5 text-sm font-medium opacity-30 pointer-events-none text-neutral-500">
                      Previous
                    </span>
                  )}

                  <span className="text-sm font-medium text-neutral-400">
                    Page {currentPage} of {totalPages}
                  </span>

                  {currentPage < totalPages ? (
                    <Link
                      href={`/content-secrets?page=${currentPage + 1}`}
                      className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium transition-all duration-300 hover:bg-white/10 hover:border-white/20 text-neutral-300 hover:text-white"
                    >
                      Next
                    </Link>
                  ) : (
                    <span className="px-5 py-2.5 rounded-full border border-white/5 bg-white/5 text-sm font-medium opacity-30 pointer-events-none text-neutral-500">
                      Next
                    </span>
                  )}
                </nav>
              )}
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
