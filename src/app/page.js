"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Lightning from "@/components/lightning";
import { Particles } from "@/components/ui/particles";
import { MaterialSymbolsStarRounded } from "@/components/icons/staricon";
import { MaterialSymbolsPlayArrowRounded } from "@/components/icons/resumebtnicon";
import Navbar from "@/components/Navbar";
import { ArrowUp, Clock, Eye, Video } from "lucide-react";
import { motion } from "framer-motion";
import "./globals.css";
import CountUp from "@/components/CountUp";
import CreatorCard from "./marquee/marguee";
import Footer from "./Footer/Footer";
import dynamic from "next/dynamic";
import { KineticText } from "@/components/ui/kinetic-text";
import { ScrollVelocityContainer, ScrollVelocityRow } from "@/components/ui/scroll-based-velocity";


const ContentFlywheel = dynamic(() => import("./flywheel/flywheel"), { ssr: false });
const Workwith = dynamic(() => import("./workwith/workwith"), { ssr: false });
const Tabssections = dynamic(() => import("./tabs/tabs"), { ssr: false });
const TestimonialCard = dynamic(() => import("./scrolls/TestimonialCard"), { ssr: false });
const FAQSection = dynamic(() => import("./FAQsection/FAQsection"), { ssr: false });

import { getWorkCards } from "@/lib/cms/workCards";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const logos = [
  "Figma",
  "Slack",
  "Discord",
  "Spotify",
  "YouTube",
  "Netflix",
  "Adobe",
  "Shopify",
  "Stripe",
  "Notion",
];

// Duplicate for seamless loop
const marqueeItems = [...logos, ...logos];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const creatorSectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const statsSectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const creatorCards = [
  {
    name: "David Wilson",
    role: "Gaming Creator",
    metric: "850K",
    highlight: "Fast turnaround",
    platform: "Youtube",
    image:
      "https://cdn.britannica.com/96/257896-159-9D7F077F/Close-up-of-blogger-filming-video-with-smartphone-on-tripod-for-online-vlog.jpg?w=385",
    growth: "305%",
  },
  {
    name: "Avery Lee",
    role: "Shop Ad",
    metric: "$4.2M",
    highlight: "Conversion first",
    platform: "TikTok",
    image:
      "https://media.istockphoto.com/id/2035048820/photo/online-beauty-influencer-presenting-products.jpg?s=2048x2048&w=is&k=20&c=WpD0gSwGiDoHYacYrfSWpF6w_o7U8tlfERezaSifP04=",
    growth: "305%",
  },
  {
    name: "Mia & Studio",
    role: "Brand Launch",
    metric: "12M",
    highlight: "Viral hooks",
    platform: "Instagram",
    image:
      "https://media.istockphoto.com/id/1313649311/photo/smiling-young-african-female-influencer-doing-a-vlog-post-at-home.jpg?s=2048x2048&w=is&k=20&c=TlLW2kz03XgY3UQhZrKGpZtGgiSyEZvzO9JJ5-lMyao=",
    growth: "305%",
  },
  {
    name: "Alex Snow",
    role: "Documentaries",
    metric: "2.1M",
    highlight: "Cinematic style",
    platform: "YouTube",
    image:
      "https://media.istockphoto.com/id/1069995244/photo/young-man-making-a-video-blog.jpg?s=612x612&w=0&k=20&c=7LC_z7o5gZcQXbKaidQDYxC54rCloepWcfJxd5-Q3b0=",
    growth: "305%",
  },
  {
    name: "Jordan Kai",
    role: "Music Visuals",
    metric: "48K",
    highlight: "Bold edits",
    platform: "TikTok",
    image:
      "https://media.istockphoto.com/id/2192390668/photo/travel-influencer.jpg?s=612x612&w=0&k=20&c=9InFbfqWRaS3Nzc6zkbJsefKGBa-QeHROG8Wr4gVirY=",
    growth: "305%",
  },
  {
    name: "Sofia Park",
    role: "Creator Growth",
    metric: "1.3M",
    highlight: "Repeatable assets",
    platform: "Instagram",
    image:
      "https://media.istockphoto.com/id/1320761320/photo/silhouette-of-an-indian-teen-vlogging-while-holding-camera-in-his-hand-teenager-vlogging-for.jpg?s=612x612&w=0&k=20&c=3uqkXTKTxcx3adickr-kt1M58TB6te2qqu508ntfsKU=",
    growth: "305%",
  },
  {
    name: "Rico Hart",
    role: "Live Events",
    metric: "780K",
    highlight: "Audience-first",
    platform: "YouTube",
    image:
      "https://media.istockphoto.com/id/1448293643/photo/gym-social-media-and-fitness-influencer-with-phone-live-streaming-workout-for-interactive.jpg?s=612x612&w=0&k=20&c=z-PnJ1B1VRNeowHIHFwfCyU9JV5ZrIvH_g0DP7LjDhk=",
    growth: "305%",
  },
  {
    name: "Nina Reed",
    role: "Premium Film",
    metric: "$1.8M",
    highlight: "High fidelity",
    platform: "YouTube",
    image:
      "https://media.istockphoto.com/id/1311101155/photo/young-social-media-influencer-recording-his-podcast-on-mobile-phone-concept-of-vlogging.jpg?s=612x612&w=0&k=20&c=c018bB0OVigKtvPUq3Z1xJj3tomD88k75kSS-mw19dk=",
    growth: "305%",
  },
];

const services = [
  {
    title: "Trailers and Long Form",
    description:
      "Campaign trailers, product stories, and flagship edits built to land attention on every screen.",
    tags: ["Brand", "Film", "Ads"],
    image: "/service-1.jpg",
  },
  {
    title: "Short Form Videos That Go Viral",
    description:
      "Reels, shorts, and launch clips designed to convert, entertain, and retain viewers instantly.",
    tags: ["TikTok", "Instagram", "YouTube"],
    image: "/service-2.jpg",
  },
  {
    title: "SaaS & Product Demos",
    description:
      "Product showcases and growth videos that turn features into storytelling with clear action.",
    tags: ["SaaS", "UX", "Growth"],
    image: "/service-3.jpg",
  },
];

const faqs = [
  {
    question: "What types of videos do you make?",
    answer:
      "We produce trailers, short-form social content, product demos, brand films, and full campaign assets for creators and teams.",
  },
  {
    question: "How fast is the turnaround?",
    answer:
      "Standard delivery is 5-7 business days, with rush options available for priority launches.",
  },
  {
    question: "What’s the briefing process?",
    answer:
      "We start with a creative brief, moodboard, and a kickoff call so every edit reflects your voice and audience.",
  },
  {
    question: "Do you handle content strategy?",
    answer:
      "Yes. We pair edit direction with platform strategy so your videos perform where they matter most.",
  },
  {
    question: "How does re-work / revision work?",
    answer:
      "Each project includes two rounds of revisions. Additional updates are available as part of ongoing support.",
  },
];

export default function Home() {
  const [cards, setCards] = useState(creatorCards);

  useEffect(() => {
    getWorkCards()
      .then((data) => {
        if (data && data.length > 0) {
          setCards(data);
        }
      })
      .catch((err) => console.error("Error fetching work cards:", err));
  }, []);



  const rowA = cards.slice(0, Math.ceil(cards.length / 2));
  const rowB = cards.slice(Math.ceil(cards.length / 2));

  return (
    <main className="min-h-screen bg-hero bg-cover text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "Rabt",
            "image": "https://rabt.in/Rabt.png",
            "url": "https://rabt.in",
            "description": "Premium video edits, crafted & delivered fast. Real editors, no AI fillers, always on time.",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "IN"
            }
          }),
        }}
      />
      <Navbar onClaimTrial={() => setIsPopupOpen(true)} />
      <section className="relative overflow-hidden px-6 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute -z-10 left-1/2 top-0 h-full w-screen -translate-x-1/2 opacity-100"
        >
          <Lightning />
          <Particles
            className="absolute inset-0 z-10"
            quantity={100}
            ease={80}
            color="#ffffff"
            size={1.5}
            refresh
            canvasOpacity={1}
          />
        </motion.div>
        <div className="mx-auto flex min-h-screen w-full flex-col items-center justify-center text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full flex flex-col items-center"
          >
            <motion.div
              variants={itemVariants}
              className="mb-6 flex flex-col items-center gap-3 text-sm text-slate-300 sm:flex-row sm:gap-4"
            >
              <div className="flex -space-x-1.5">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="avatar"
                  width={32}
                  height={32}
                  priority
                  fetchPriority="high"
                  className="inline-flex h-8 w-8 rounded-full border border-slate-950 object-cover"
                />
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="avatar"
                  width={32}
                  height={32}
                  priority
                  fetchPriority="high"
                  className="inline-flex h-8 w-8 rounded-full border border-slate-950 object-cover"
                />
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="avatar"
                  width={32}
                  height={32}
                  priority
                  fetchPriority="high"
                  className="inline-flex h-8 w-8 rounded-full border border-slate-950 object-cover"
                />
                <Image
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="avatar"
                  width={32}
                  height={32}
                  priority
                  fetchPriority="high"
                  className="inline-flex h-8 w-8 rounded-full border border-slate-950 object-cover"
                />
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center text-amber-300 gap-[2.5px] scale-110">
                  <MaterialSymbolsStarRounded />
                  <MaterialSymbolsStarRounded />
                  <MaterialSymbolsStarRounded />
                  <MaterialSymbolsStarRounded />
                  <MaterialSymbolsStarRounded />
                </div>
                <span className="text-neutral-400 font-semibold plus-jakarta-sans text-sm sm:text-base">
                  Trusted by agencies, brands, and creators
                </span>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mx-auto flex flex-col items-center text-3xl public-sans font-bold tracking-tight text-white sm:text-6xl sm:leading-[1.05] select-none cursor-default"
            >
              <KineticText
                text="Get world-class content"
                className="justify-center text-3xl sm:text-6xl font-bold public-sans tracking-tight text-white sm:leading-[1.05]"
              />
              <KineticText
                text="without building an in-house team."
                className="justify-center text-3xl sm:text-6xl font-bold public-sans tracking-tight text-white sm:leading-[1.05]"
              />
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-3xl text-base leading-7 text-neutral-400 sm:text-lg font-semibold plus-jakarta-sans"
            >
              Access a dedicated team of professionals <br />without the cost, hiring, or management headaches.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row mt-16"
            >
              <button
                onClick={() => setIsPopupOpen(true)}
                className="inline-flex gap-1 items-center plus-jakarta-sans font-semibold justify-center rounded-full bg-white px-11 py-[18px] text-[16px] text-slate-950 shadow-[0_15px_30px_rgba(15,23,42,0.18)] hover:bg-slate-100 hover:gap-4 transition-[gap] duration-700"
              >
                Lets get connected<ArrowUp className="w-4 rotate-90" />
              </button>
              <a
                href="#work"
                className="inline-flex items-center justify-center backdrop-blur-[5px] gap-1 rounded-full border border-white/15 bg-black/10 px-11 py-[18px] text-[16px] font-semibold text-white hover:border-white/10 hover:bg-white/15  hover:gap-4 transition-[gap] duration-700"
              >
                <MaterialSymbolsPlayArrowRounded />See how we deliver
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <section>
        <Workwith></Workwith>
      </section>
      <motion.section
        id="work"
        initial="hidden"
        whileInView="visible"
        variants={creatorSectionVariants}
        viewport={{ once: true, amount: 0.3 }}
        className="relative bg-black w-screen overflow-hidden pt-20 pb-0 sm:pt-24 sm:pb-0"
      >
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `
          linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
        `,
              backgroundSize: "80px 80px",
              maskImage:
                "radial-gradient(circle at center, white, transparent 85%)",
            }}
          />
        </div>

        <div className="relative mx-auto w-full user-select-none max-w-none px-6 lg:px-10">
          <motion.div
            variants={itemVariants}
            className="w-full flex justify-center uppercase text-center plus-jakarta-sans-200 text-neutral-500 tracking-[2px] text-[10px] sm:text-xs"
          >
            Worldclass content. Proven impact.
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="w-full flex justify-center text-center bricolage-grotesque text-white tracking-[1px] sm:tracking-[2px] text-3xl sm:text-5xl font-black mt-2"
          >
            Trusted By
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="w-full flex justify-center text-center plus-jakarta-sans-200 text-neutral-500 text-xs sm:text-sm mt-3 max-w-md mx-auto"
          >
            Those who take their content seriously.
          </motion.div>

          <ScrollVelocityContainer className="relative overflow-hidden flex flex-col gap-6 pt-20 pb-0">
            {/* Row 1 — left */}
            <ScrollVelocityRow baseVelocity={6} direction={1}>
              {rowA.map((card, idx) => (
                <div key={`a-${card.name}-${idx}`} className="px-3">
                  <CreatorCard card={card} />
                </div>
              ))}
            </ScrollVelocityRow>

            {/* Row 2 — right */}
            <ScrollVelocityRow baseVelocity={6} direction={-1}>
              {rowB.map((card, idx) => (
                <div key={`b-${card.name}-${idx}`} className="px-3">
                  <CreatorCard card={card} />
                </div>
              ))}
            </ScrollVelocityRow>
          </ScrollVelocityContainer>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={statsSectionVariants}
        viewport={{ amount: 0.3 }}
        className="mt-[100px] mb-2 sm:mb-4"
      >
        <div className="relative w-full flex flex-row justify-center items-center bricolage-grotesque gap-0.5 sm:gap-10 font-black py-4 sm:py-10 mb-2 sm:mb-6">
          {/* Top border line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
          {/* Bottom border line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

          {/* Stat 1 */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center flex-1 px-1 sm:px-20"
          >
            <Clock
              color="#fff"
              className="mb-2 sm:mb-5 w-3.5 h-3.5 sm:w-6 sm:h-6"
            />
            <div className="text-lg xs:text-xl sm:text-6xl flex justify-center">
              <CountUp
                from={0}
                to={300}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text"
                delay={0}
              />
              M+
            </div>
            <div className="text-[8px] xs:text-[10px] sm:text-sm text-neutral-500 mt-1.5 text-center">
              View Generated
            </div>
          </motion.div>

          {/* Stat 2 */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center flex-1 px-1 sm:px-20 border-l border-r border-white/10"
          >
            <Clock
              color="#fff"
              className="mb-2 sm:mb-5 w-3.5 h-3.5 sm:w-6 sm:h-6"
            />
            <div className="text-lg xs:text-xl sm:text-6xl flex justify-center">
              <CountUp
                from={0}
                to={2}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text"
                delay={0}
              />
              + Years
            </div>
            <div className="text-[8px] xs:text-[10px] sm:text-sm text-neutral-500 mt-1.5 text-center">
              Experience
            </div>
          </motion.div>

          {/* Stat 3 */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center flex-1 px-1 sm:px-20"
          >
            <Video
              color="#fff"
              className="mb-2 sm:mb-5 w-3.5 h-3.5 sm:w-6 sm:h-6"
            />
            <div className="text-lg xs:text-xl sm:text-6xl flex justify-center">
              <CountUp
                from={0}
                to={20000}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text"
                delay={0}
              />
              +
            </div>
            <div className="text-[8px] xs:text-[10px] sm:text-sm text-neutral-500 mt-1.5 text-center">
              Videos Created
            </div>
          </motion.div>
        </div>
      </motion.section>
      <section className="relative bg-black w-full overflow-hidden py-8 sm:py-16">
        {/* Section label */}
        <p
          style={{
            textAlign: "center",
            letterSpacing: "0.2em",
            fontSize: "11px",
            color: "#555",
            marginBottom: "28px",
            fontFamily: "sans-serif",
            textTransform: "uppercase",
          }}
          className="mt-4 sm:mt-10"
        >
          Trusted by partners
        </p>

        {/* Left fade */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "120px",
            background: "linear-gradient(to right, black, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Right fade */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "120px",
            background: "linear-gradient(to left, black, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Scrolling track */}
        <div style={{ overflow: "hidden", width: "100%" }}>
          <div
            style={{
              display: "flex",
              gap: "72px",
              width: "max-content",
              animation: "marquee-scroll 30s linear infinite",
            }}
          >
            {marqueeItems.map((name, index) => (
              <span
                key={index}
                style={{
                  fontFamily: "Bricolage Grotesque, sans-serif",
                  fontWeight: "700",
                  fontSize: "28px",
                  color: "#2a2a2a",
                  whiteSpace: "nowrap",
                  userSelect: "none",
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Keyframe injection */}
        <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      </section>
      <section id="reviews">
        <TestimonialCard />
      </section>
      <section id="services">
        <Tabssections />
      </section>
      <section>
        <ContentFlywheel />
      </section>
      <section
        id="contact"
        className="py-10 sm:py-24 px-6 relative bg-[#050507]"
      >
        <div className="mx-auto max-w-4xl text-center mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            SCHEDULE
          </p>
          <h2
            className="text-3xl sm:text-5xl font-extrabold text-white"
            style={{
              fontFamily: '"Bricolage Grotesque", sans-serif',
              fontOpticalSizing: "auto",
              fontStyle: "normal",
              fontVariationSettings: '"wdth" 100',
              fontWeight: 800,
            }}
          >
            Book a Discovery Call
          </h2>
        </div>
        {/* <div className="mx-auto max-w-4xl rounded-2xl overflow-hidden border border-white/10 bg-white shadow-2xl">
          <iframe
            src="https://calendly.com/flare-exc/30min?background_color=08080a&text_color=ffffff&primary_color=ffffff"
            width="100%"
            height="950px"
            frameBorder="0"
            scrolling="no"
            style={{
              minWidth: "320px",
              height: "950px",
              border: "none",
              overflow: "hidden",
            }}
          />
        </div> */}
      </section>
      <section id="faq">
        <FAQSection />
      </section>
      <Footer />
    </main>
  );
}
