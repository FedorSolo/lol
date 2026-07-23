"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { PublicExpedition } from "@/lib/expeditions-shared";
import type { Locale } from "@/lib/supabase/database.types";

export default function Contact({ expeditions }: { expeditions: PublicExpedition[] }) {
  const t = useTranslations("contact");
  const locale = useLocale() as Locale;
  const activityLevels = t.raw("activityLevels") as string[];
  const experienceLevels = t.raw("experienceLevels") as string[];

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const { error } = await supabase.from("applications").insert({
      first_name: String(formData.get("first_name") ?? ""),
      last_name: String(formData.get("last_name") ?? ""),
      email: String(formData.get("email") ?? ""),
      whatsapp: String(formData.get("whatsapp") ?? "") || null,
      telegram: String(formData.get("telegram") ?? "") || null,
      country: String(formData.get("country") ?? "") || null,
      age: formData.get("age") ? Number(formData.get("age")) : null,
      expedition_id: String(formData.get("expedition_id") ?? "") || null,
      hiking_experience: String(formData.get("hiking_experience") ?? "") || null,
      climbing_experience: String(formData.get("climbing_experience") ?? "") || null,
      altitude_experience: String(formData.get("altitude_experience") ?? "") || null,
      fitness_level: String(formData.get("fitness_level") ?? "") || null,
      trainings_per_week: String(formData.get("trainings_per_week") ?? "") || null,
      sports_practiced: String(formData.get("sports_practiced") ?? "") || null,
      medical_notes: String(formData.get("medical_notes") ?? "") || null,
      extra_info: String(formData.get("extra_info") ?? "") || null,
      consent_given: formData.get("consent") === "on",
      locale,
    });

    setSubmitting(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSubmitted(true);
  }

  const inputClass =
    "w-full bg-transparent border border-white/20 px-4 py-3 text-snow placeholder:text-mist/60 focus:border-glacier-light outline-none transition-colors";
  const labelClass = "block text-xs uppercase tracking-wide text-mist mb-2";

  return (
    <section id="contact" className="relative bg-obsidian py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 opacity-25">
        <img
          src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=2400&auto=format&fit=crop"
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/85 to-obsidian" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-10 text-center">
        <p className="font-mono text-xs tracking-widest2 uppercase text-glacier-light mb-6">
          {t("eyebrow")}
        </p>
        <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl md:text-6xl leading-[1.02] text-snow text-balance">
          {t("title1")}
          <br />
          {t("title2")}
        </h2>
        <p className="mt-6 text-mist text-base md:text-lg max-w-xl mx-auto">{t("subtitle")}</p>

        <div className="mt-14 text-left">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center gap-4 py-16 border border-white/10 bg-ash/60"
            >
              <CheckCircle2 className="w-10 h-10 text-glacier-light" strokeWidth={1.5} />
              <p className="font-display text-2xl uppercase text-snow">{t("successTitle")}</p>
              <p className="text-mist text-sm max-w-sm">{t("successText")}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="first_name" className={labelClass}>{t("firstName")}</label>
                <input id="first_name" name="first_name" required type="text" className={inputClass} />
              </div>
              <div>
                <label htmlFor="last_name" className={labelClass}>{t("lastName")}</label>
                <input id="last_name" name="last_name" required type="text" className={inputClass} />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>{t("email")}</label>
                <input id="email" name="email" required type="email" className={inputClass} />
              </div>
              <div>
                <label htmlFor="whatsapp" className={labelClass}>{t("whatsapp")}</label>
                <input id="whatsapp" name="whatsapp" type="tel" placeholder="+7 999 000-00-00" className={inputClass} />
              </div>

              <div>
                <label htmlFor="telegram" className={labelClass}>{t("telegram")}</label>
                <input id="telegram" name="telegram" type="text" placeholder="@username" className={inputClass} />
              </div>
              <div>
                <label htmlFor="country" className={labelClass}>{t("country")}</label>
                <input id="country" name="country" type="text" className={inputClass} />
              </div>

              <div>
                <label htmlFor="age" className={labelClass}>{t("age")}</label>
                <input id="age" name="age" type="number" min={16} max={90} className={inputClass} />
              </div>
              <div>
                <label htmlFor="expedition_id" className={labelClass}>{t("peak")}</label>
                <select id="expedition_id" name="expedition_id" defaultValue="" className={inputClass}>
                  <option value="" className="bg-obsidian">—</option>
                  {expeditions.map((exp) => (
                    <option key={exp.id} value={exp.id} className="bg-obsidian">
                      {exp.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="hiking_experience" className={labelClass}>{t("hikingExperience")}</label>
                <input
                  id="hiking_experience"
                  name="hiking_experience"
                  type="text"
                  placeholder={t("hikingExperiencePlaceholder")}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="climbing_experience" className={labelClass}>{t("experience")}</label>
                <select id="climbing_experience" name="climbing_experience" defaultValue={experienceLevels[0]} className={inputClass}>
                  {experienceLevels.map((l) => (
                    <option key={l} value={l} className="bg-obsidian">{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="altitude_experience" className={labelClass}>{t("altitudeExperience")}</label>
                <input
                  id="altitude_experience"
                  name="altitude_experience"
                  type="text"
                  placeholder={t("altitudeExperiencePlaceholder")}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="fitness_level" className={labelClass}>{t("level")}</label>
                <select id="fitness_level" name="fitness_level" defaultValue={activityLevels[1]} className={inputClass}>
                  {activityLevels.map((l) => (
                    <option key={l} value={l} className="bg-obsidian">{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="trainings_per_week" className={labelClass}>{t("trainingsPerWeek")}</label>
                <input id="trainings_per_week" name="trainings_per_week" type="number" min={0} max={14} className={inputClass} />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="sports_practiced" className={labelClass}>{t("sportsPracticed")}</label>
                <input
                  id="sports_practiced"
                  name="sports_practiced"
                  type="text"
                  placeholder={t("sportsPracticedPlaceholder")}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="medical_notes" className={labelClass}>{t("medicalNotes")}</label>
                <textarea
                  id="medical_notes"
                  name="medical_notes"
                  rows={2}
                  placeholder={t("medicalNotesPlaceholder")}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="extra_info" className={labelClass}>{t("message")}</label>
                <textarea
                  id="extra_info"
                  name="extra_info"
                  rows={3}
                  placeholder={t("messagePlaceholder")}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="sm:col-span-2 flex items-start gap-3">
                <input id="consent" name="consent" type="checkbox" required className="mt-1 w-4 h-4" />
                <label htmlFor="consent" className="text-sm text-mist">{t("consent")}</label>
              </div>

              {errorMsg && <p className="sm:col-span-2 text-sm text-red-400">{errorMsg}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="sm:col-span-2 mt-2 bg-snow text-obsidian px-7 py-4 text-sm tracking-wide font-medium hover:bg-glacier-light transition-colors disabled:opacity-60"
              >
                {submitting ? "…" : t("submitButton")}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
