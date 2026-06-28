import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import FeaturedCollection from "@/components/sections/FeaturedCollection";
import BrandStory from "@/components/sections/BrandStory";
import SignatureMoment from "@/components/sections/SignatureMoment";
import Newsletter from "@/components/sections/Newsletter";
import SectionChapter from "@/components/ui/SectionChapter";

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <SectionChapter number="02" label="The Edit" />
      <FeaturedCollection />
      <SectionChapter number="03" label="Philosophy" dark />
      <BrandStory />
      <SectionChapter number="04" label="Atelier" dark />
      <SignatureMoment />
      <SectionChapter number="05" label="Invitation" />
      <Newsletter />
      <Footer />
    </main>
  );
}
