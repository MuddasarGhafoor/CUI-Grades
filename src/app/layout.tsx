import type { Metadata, Viewport } from "next";
import { Carter_One, Geist, Geist_Mono } from "next/font/google";
import { PrintSheet } from "@/components/export/print-sheet";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { VoiceDock } from "@/components/voice/voice-dock";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const carterOne = Carter_One({
  variable: "--font-carter-one",
  weight: "400",
  subsets: ["latin"],
});

const DEFAULT_TITLE = "CUI-Grades: GPA, CGPA & internal marks calculator";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "CUI GPA calculator",
    "COMSATS GPA calculator",
    "COMSATS CGPA calculator",
    "CUI internal marks",
    "sessional marks calculator",
    "COMSATS grading scale",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "en_PK",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b1120" },
    { media: "(prefers-color-scheme: light)", color: "#f7f8fa" },
  ],
};

// Runs before paint so the saved theme applies without a flash. Dark is the default.
const themeScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${carterOne.variable} flex min-h-dvh flex-col antialiased`}
      >
        <Navbar />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
          {children}
        </main>
        <Footer />
        <VoiceDock />
        <PrintSheet />
      </body>
    </html>
  );
}
