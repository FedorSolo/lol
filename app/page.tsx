import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import WhyDifferent from "@/components/WhyDifferent";
import Expeditions from "@/components/Expeditions";
import Timeline from "@/components/Timeline";
import Team from "@/components/Team";
import Audience from "@/components/Audience";
import ApplicationProcess from "@/components/ApplicationProcess";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-obsidian">
      <Navbar />
      <Hero />
      <Philosophy />
      <WhyDifferent />
      <Expeditions />
      <Timeline />
      <Team />
      <Audience />
      <ApplicationProcess />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
