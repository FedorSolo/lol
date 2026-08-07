import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrainingProgram from "@/components/TrainingProgram";
import { getHomepageContent } from "@/lib/site-content-data";
import { buildHreflangAlternates } from "@/lib/site-url";
import type { Locale } from "@/lib/supabase/database.types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = await getHomepageContent(locale as Locale);
  return {
    title: `${content.trainingProgram.title1} ${content.trainingProgram.title2} | CumbrePeak`,
    description: content.trainingProgram.intro.replace(/\n/g, " "),
    alternates: { languages: buildHreflangAlternates("/preparation") },
  };
}

export default async function PreparationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = await getHomepageContent(locale as Locale);

  return (
    <main className="bg-obsidian">
      <Navbar />
      <div className="pt-20">
        <TrainingProgram content={content.trainingProgram} />
      </div>
      <Footer />
    </main>
  );
}
