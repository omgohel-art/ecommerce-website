import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ExperienceShell from "@/components/ExperienceShell";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "ATELIER NOCTURN — Luxury Fashion",
  description:
    "After dusk, form emerges. An editorial luxury fashion house crafting nocturnal silhouettes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="bg-ivory text-ink antialiased">
        <SmoothScroll>
          <ExperienceShell>{children}</ExperienceShell>
        </SmoothScroll>
      </body>
    </html>
  );
}
