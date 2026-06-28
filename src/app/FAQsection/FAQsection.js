"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getFAQs } from "@/lib/cms/faqs";

const faqs = [
  {
    question: "What types of videos do you edit?",
    answer:
      "We specialize in long-form YouTube content, short-form social media videos (TikTok, Reels, Shorts), SaaS product demos, podcast episodes, and brand content. Whatever your format, we've got you covered.",
  },
  {
    question: "How fast is the turnaround?",
    answer:
      "Most projects are delivered within 48–72 hours. For rush requests or larger volumes, we'll agree on a timeline upfront so you're never left waiting.",
  },
  {
    question: "What's the pricing structure?",
    answer:
      "We offer flexible plans based on volume and frequency. Whether you need a one-off edit or a monthly retainer, we have options that scale with your content needs.",
  },
  {
    question: "Do you handle content strategy?",
    answer:
      "Yes — beyond editing, we can advise on content structure, pacing, hooks, and formats that perform best on each platform to maximize your reach.",
  },
  {
    question: "How does the onboarding process work?",
    answer:
      "Once you reach out, we schedule a quick call to understand your brand, goals, and style preferences. From there, we set up a shared workflow and you start sending us footage.",
  },
  {
    question: "Can I see samples of your work?",
    answer:
      "Absolutely. Head to the Work section of our site or book a call and we'll share a curated portfolio relevant to your niche.",
  },
];

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden">
      <button
        onClick={onToggle}
        className="flex w-full items-center rounded-2xl justify-between px-6 py-5 text-left"
      >
        <span className="text-base text-white">{question}</span>

        {/* + icon rotates 45deg to become × */}
        <span className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/70">
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex items-center justify-center"
            style={{ lineHeight: 0 }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 1V9M1 5H9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </motion.span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-sm leading-relaxed text-white/50">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [list, setList] = useState(faqs);

  useEffect(() => {
    getFAQs()
      .then((data) => {
        if (data && data.length > 0) {
          setList(data);
        }
      })
      .catch((err) => console.error("Error fetching FAQs:", err));
  }, []);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="px-6 py-10 sm:py-24">
      <div className="mx-auto max-w-2xl">
        {/* Label */}
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          FAQ
        </p>

        {/* Heading */}
        <h2
          className="mb-8 sm:mb-16 text-center text-3xl sm:text-5xl font-extrabold text-white"
          style={{
            fontFamily: '"Bricolage Grotesque", sans-serif',
            fontOpticalSizing: "auto",
            fontStyle: "normal",
            fontVariationSettings: '"wdth" 100',
            fontWeight: 800,
          }}
        >
          Everything you need to know
        </h2>

        {/* Accordion — each item is its own card with gap between */}
        <div className="flex flex-col gap-3">
          {list.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => toggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
