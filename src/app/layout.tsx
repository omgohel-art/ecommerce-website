import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ExperienceShell from "@/components/ExperienceShell";

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
    <html lang="en">
      <body className="bg-ivory text-ink antialiased">
        <SmoothScroll>
          <ExperienceShell>{children}</ExperienceShell>
        </SmoothScroll>
      </body>
    </html>
  );
}
