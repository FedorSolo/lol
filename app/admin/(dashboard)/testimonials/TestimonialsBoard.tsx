"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import TestimonialCard, { type ExpeditionOption } from "./TestimonialCard";
import type { TestimonialFormData } from "./actions";
import type { Locale } from "@/lib/supabase/database.types";

function blankTestimonial(sortOrder: number): TestimonialFormData {
  return {
    author_name: "",
    author_photo_url: null,
    expedition_id: "",
    rating: 5,
    is_published: true,
    sort_order: sortOrder,
    i18n: {
      ru: { quote: "", role_context: "" },
      es: { quote: "", role_context: "" },
      en: { quote: "", role_context: "" },
    } as Record<Locale, { quote: string; role_context: string }>,
  };
}

export default function TestimonialsBoard({
  testimonials,
  expeditions,
}: {
  testimonials: TestimonialFormData[];
  expeditions: ExpeditionOption[];
}) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<TestimonialFormData[]>([]);

  return (
    <div className="flex flex-col gap-6">
      {testimonials.map((testimonial) => (
        <TestimonialCard
          key={testimonial.id}
          testimonial={testimonial}
          expeditions={expeditions}
          onSaved={() => router.refresh()}
        />
      ))}
      {drafts.map((draft, i) => (
        <TestimonialCard
          key={`draft-${i}`}
          testimonial={draft}
          expeditions={expeditions}
          onSaved={() => {
            setDrafts((d) => d.filter((_, idx) => idx !== i));
            router.refresh();
          }}
        />
      ))}

      <button
        onClick={() => setDrafts((d) => [...d, blankTestimonial(testimonials.length + d.length)])}
        className="inline-flex items-center gap-2 self-start border border-white/20 text-snow px-5 py-2.5 text-sm hover:border-glacier-light transition-colors"
      >
        <Plus className="w-4 h-4" />
        Добавить отзыв
      </button>
    </div>
  );
}
