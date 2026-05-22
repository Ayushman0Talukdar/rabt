import Lightning from "@/components/lightning";
import { MaterialSymbolsStarRounded } from "@/components/icons/staricon";
import { MaterialSymbolsPlayArrowRounded } from "@/components/icons/resumebtnicon";
import Navbar from "@/components/Navbar";
import { ArrowUp } from 'lucide-react';
import "./globals.css";

const creatorCards = [
  { name: "David Wilson", role: "Gaming Creator", metric: "850K", highlight: "Fast turnaround" },
  { name: "Avery Lee", role: "Shop Ad", metric: "$4.2M", highlight: "Conversion first" },
  { name: "Mia & Studio", role: "Brand Launch", metric: "12M", highlight: "Viral hooks" },
  { name: "Alex Snow", role: "Documentaries", metric: "2.1M", highlight: "Cinematic style" },
  { name: "Jordan Kai", role: "Music Visuals", metric: "48K", highlight: "Bold edits" },
  { name: "Sofia Park", role: "Creator Growth", metric: "1.3M", highlight: "Repeatable assets" },
  { name: "Rico Hart", role: "Live Events", metric: "780K", highlight: "Audience-first" },
  { name: "Nina Reed", role: "Premium Film", metric: "$1.8M", highlight: "High fidelity" },
];

const services = [
  { title: "Trailers and Long Form", description: "Campaign trailers, product stories, and flagship edits built to land attention on every screen.", tags: ["Brand", "Film", "Ads"], image: "/service-1.jpg" },
  { title: "Short Form Videos That Go Viral", description: "Reels, shorts, and launch clips designed to convert, entertain, and retain viewers instantly.", tags: ["TikTok", "Instagram", "YouTube"], image: "/service-2.jpg" },
  { title: "SaaS & Product Demos", description: "Product showcases and growth videos that turn features into storytelling with clear action.", tags: ["SaaS", "UX", "Growth"], image: "/service-3.jpg" },
];

const faqs = [
  { question: "What types of videos do you make?", answer: "We produce trailers, short-form social content, product demos, brand films, and full campaign assets for creators and teams." },
  { question: "How fast is the turnaround?", answer: "Standard delivery is 5-7 business days, with rush options available for priority launches." },
  { question: "What’s the briefing process?", answer: "We start with a creative brief, moodboard, and a kickoff call so every edit reflects your voice and audience." },
  { question: "Do you handle content strategy?", answer: "Yes. We pair edit direction with platform strategy so your videos perform where they matter most." },
  { question: "How does re-work / revision work?", answer: "Each project includes two rounds of revisions. Additional updates are available as part of ongoing support." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-hero bg-cover text-white">
        <Navbar />
      <section className="relative overflow-hidden px-6 pb-16 pt-6">
        <div className="absolute -z-10 left-1/2 top-0 h-full w-screen -translate-x-1/2 opacity-50 ">
          <Lightning />
        </div>
        <div className="mx-auto flex min-h-screen w-full flex-col items-center justify-center text-center">
          <div className="mb-5 flex flex-col items-center gap-2 text-xs text-slate-300 sm:flex-row sm:gap-3">
            <div className="flex -space-x-1">
              <span className="inline-flex h-6 w-6 rounded-full border border-slate-950 bg-white" />
              <span className="inline-flex h-6 w-6 rounded-full border border-slate-950 bg-slate-700" />
              <span className="inline-flex h-6 w-6 rounded-full border border-slate-950 bg-slate-600" />
              <span className="inline-flex h-6 w-6 rounded-full border border-slate-950 bg-slate-800" />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-300 gap-[2px]">
                <MaterialSymbolsStarRounded />
                <MaterialSymbolsStarRounded />
                <MaterialSymbolsStarRounded />
                <MaterialSymbolsStarRounded />
                <MaterialSymbolsStarRounded />
              </div>
              <span className="text-neutral-500 font-semibold plus-jakarta-sans">Trusted by 40+ brands & creators</span>
            </div>
          </div>

          <h1 className="mx-auto max-w-[18ch] text-3xl bricolage-grotesque font-black tracking-tighter text-white sm:text-6xl sm:leading-[1.05]">
            Premium video edits,
            <br />
            crafted & delivered fast.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-500 sm:text-base font-semibold plus-jakarta-sans">
            Affordable, fast, human powered video edits.
            <br />
            Real editors, no AI fillers, always on time.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#contact" className="inline-flex gap-1 items-center plus-jakarta-sans font-normal justify-center rounded-full bg-white px-9 py-3.75 text-sm text-slate-950 shadow-[0_15px_30px_rgba(15,23,42,0.18)] transition hover:bg-slate-100">
              Book a Call <ArrowUp className="w-4 rotate-90"/>
            </a>
            <a href="#work" className="inline-flex items-center justify-center backdrop-blur-2xl gap-1 rounded-full border border-white/15 bg-white/10 px-9 py-3.75 text-sm font-semibold text-white transition hover:border-white/10 hover:bg-white/15">
             <MaterialSymbolsPlayArrowRounded/> View Our Work 
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 pb-20 pt-16">
        <div className="container mx-auto space-y-8">
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-400">
            <span>Trusted by creators, studios, founders, and brands</span>
            <span className="inline-flex h-1 w-1 rounded-full bg-slate-500" />
            <span>Fast delivery</span>
            <span className="inline-flex h-1 w-1 rounded-full bg-slate-500" />
            <span>Cinematic edits</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-5">
            {['Creators', 'Founders', 'Studios', 'Directors', 'Brands', 'Agencies', 'Publishers', 'Entrepreneurs', 'Retailers'].slice(0, 5).map((label) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-slate-200">
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="container mx-auto px-6 pb-20">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Creators who trust us</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">Stories that drive views, revenue, and momentum.</h2>
        </div>
        <div className="mt-10 grid gap-6 xl:grid-cols-4 lg:grid-cols-2">
          {creatorCards.map((creator) => (
            <article key={creator.name} className="group overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/10">
              <div className="mb-5 h-48 rounded-3xl bg-slate-900/90" />
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>{creator.role}</span>
                  <span className="rounded-full bg-white/5 px-3 py-1">{creator.metric}</span>
                </div>
                <h3 className="text-xl font-semibold">{creator.name}</h3>
                <p className="text-slate-400">{creator.highlight}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 pb-20">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6 rounded-4xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-950/80 px-4 py-2 text-sm text-slate-300">
              9M+ views across launches
            </div>
            <h2 className="text-3xl font-semibold">Every edit is built to perform.</h2>
            <p className="max-w-2xl text-slate-300">From hero campaigns to rapid social drops, our work pairs cinematic polish with data-led storytelling.</p>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { value: '9M+', label: 'Views delivered' },
                { value: '0+', label: 'Content brands' },
                { value: '94+', label: 'Video clients' },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-3xl font-semibold">{item.value}</p>
                  <p className="mt-2 text-sm text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-4xl border border-white/10 bg-slate-950/70 p-7">
              <h3 className="text-xl font-semibold">What our clients say</h3>
              <p className="mt-3 text-slate-400">Honest feedback from teams who use our edits to launch products, grow channels, and increase conversions.</p>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Amina Rivera', role: 'Founder', quote: 'They turned our launch into a story that scaled immediately. Fast, polished, and easy to work with.' },
                { name: 'Noah Carter', role: 'Content Lead', quote: 'The edits felt premium and still moved quickly. Every asset landed better than expected.' },
              ].map((item) => (
                <div key={item.name} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                  <p className="text-slate-300">“{item.quote}”</p>
                  <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
                    <span>{item.name}</span>
                    <span>{item.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="container mx-auto px-6 pb-20">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Our services</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">Built for creators, launches, and brands.</h2>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <article key={service.title} className="overflow-hidden rounded-4xl border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(8,10,24,0.35)] transition hover:-translate-y-1">
              <div className="h-56 bg-slate-900/90" />
              <div className="space-y-4 p-6">
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">{tag}</span>
                  ))}
                </div>
                <h3 className="text-2xl font-semibold">{service.title}</h3>
                <p className="text-slate-400">{service.description}</p>
                <a href="#contact" className="inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-slate-100">
                  Learn more →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="faq" className="border-t border-white/10 px-6 pb-24 pt-20">
        <div className="container mx-auto max-w-3xl space-y-6 text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Got questions?</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">Everything clients ask before launch.</h2>
          <div className="space-y-4">
            {faqs.map((item) => (
              <details key={item.question} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <summary className="cursor-pointer text-left text-lg font-semibold text-white">{item.question}</summary>
                <p className="mt-3 text-slate-400">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-linear-to-b from-slate-950/90 to-slate-900 px-6 py-24">
        <div className="container mx-auto rounded-[3rem] border border-white/10 bg-white/5 p-12 text-center shadow-[0_40px_120px_rgba(0,0,0,0.4)]">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Ready to level up?</p>
          <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">Launch your next video campaign with confidence.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">Book a discovery call and see how our edits can speed your launch and amplify your results.</p>
          <a href="mailto:hello@rabt.com" className="mt-8 inline-flex rounded-full bg-white px-10 py-4 font-semibold text-slate-950 transition hover:bg-slate-100">
            Book a discovery call
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-slate-950/70 px-6 py-12 text-slate-400">
        <div className="container mx-auto grid gap-6 lg:grid-cols-[1.4fr_0.6fr_0.8fr]">
          <div className="space-y-4">
            <div className="text-xl font-semibold text-red">RABT</div>
            <p className="bricolage-grotesque">Premium video edits, crafted for creators and brands who need speed, polish, and results.</p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm uppercase tracking-[0.3em] text-slate-400">Quick links</h3>
            <a href="#services" className="block hover:text-white">Services</a>
            <a href="#work" className="block hover:text-white">Creators</a>
            <a href="#faq" className="block hover:text-white">FAQ</a>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm uppercase tracking-[0.3em] text-slate-400">Contact</h3>
            <p>hello@rabt.com</p>
            <p>© 2026 RABT</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
