import type { Metadata, Viewport } from "next";
import { Carter_One, Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
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
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1c" },
    { media: "(prefers-color-scheme: light)", color: "#f4f7fb" },
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
        className={`${geistSans.variable} ${geistMono.variable} ${carterOne.variable} antialiased`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
