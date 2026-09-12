import type { Metadata } from "next";
import { BitcoinRain } from "@/components/brand/BitcoinRain";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { MemeDesk } from "@/components/site/MemeDesk";
import { SiteTapes } from "@/components/site/SiteTapes";
import { getBurnSnapshot } from "@/lib/burn";
import { project } from "@/lib/config";
import { getPriceTape } from "@/lib/tape";

export const revalidate = 30;

const title = `Steal these | ${project.name}`;
const description =
  "Too lazy to post? Steal official $Pump CTO cards, copy the caption, and dump them on X.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/memes",
  },
  openGraph: {
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    site: "@ynmontyy",
    creator: "@ynmontyy",
    title,
    description,
  },
};

export default async function MemesPage() {
  const [tape, burn] = await Promise.all([getPriceTape(), getBurnSnapshot()]);
  return (
    <>
      <BitcoinRain />
      <SiteTapes tape={tape} burn={burn} />
      <Header />
      <main>
        <MemeDesk />
      </main>
      <Footer />
    </>
  );
}
