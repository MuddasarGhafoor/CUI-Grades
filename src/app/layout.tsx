import type { Metadata, Viewport } from "next";
import { Carter_One, Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
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

export const metadata: Metadata = {
  title: {
    default: "CUI-Grades: GPA, CGPA & internal marks calculator",
    template: "%s · CUI-Grades",
  },
  description:
    "Calculate CUI internal marks, semester GPA and CGPA with pre-filled totals, keyboard-friendly inputs and voice commands.",
  applicationName: "CUI-Grades",
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
      </body>
    </html>
  );
}
