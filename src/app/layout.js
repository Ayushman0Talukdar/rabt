import { Geist, Geist_Mono, Inter, Plus_Jakarta_Sans, Bricolage_Grotesque, Public_Sans } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import CursorFollower from "@/components/CursorFollower";
import DevToolsWrapper from "@/components/DevToolsWrapper";
import LeadPopupWrapper from "@/components/LeadPopupWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
  display: "swap",
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://rabt.in"),
  title: "Rabt | Premium Video Editing Services for Creators & Brands",
  description: "Affordable, fast, human-powered video edits. Real editors, no AI fillers, always on time. Trusted by 40+ brands & creators.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Rabt | Premium Video Editing Services for Creators & Brands",
    description: "Affordable, fast, human-powered video edits. Real editors, no AI fillers, always on time.",
    url: "https://rabt.in",
    siteName: "Rabt",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rabt | Premium Video Editing Services for Creators & Brands",
    description: "Affordable, fast, human-powered video edits. Real editors, no AI fillers, always on time.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${plusJakartaSans.variable} ${bricolageGrotesque.variable} ${publicSans.variable} antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body className="bg-[#050507]">
        <LenisProvider>
          <DevToolsWrapper>
            <CursorFollower />
            <LeadPopupWrapper />
            {children}
          </DevToolsWrapper>
        </LenisProvider>
      </body>
    </html>
  );
}
