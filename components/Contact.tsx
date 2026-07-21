"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { expeditions } from "@/lib/data";

const activityLevels = [
  "Начинающий — тренируюсь нерегулярно",
  "Любитель — тренируюсь 2–3 раза в неделю",
  "Продвинутый — регулярные тренировки, есть выносливость",
  "Спортсмен — соревновательный уровень",
];

const experienceLevels = [
  "Не было восхождений",
  "Треккинг без технических элементов",
  "Есть опыт восхождений до 5 000 м",
  "Есть опыт восхождений выше 5 000 м",
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // No backend is wired up — this is a static demo page.
    setSubmitted(true);
  }

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
          Приём заявок открыт
        </p>
        <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl md:text-6xl leading-[1.02] text-snow text-balance">
          Подать заявку
          <br />
          на экспедицию
        </h2>
        <p className="mt-6 text-mist text-base md:text-lg max-w-xl mx-auto">
          Мы свяжемся с вами для видео-интервью в течение суток и обсудим план подготовки под
          выбранную вершину.
        </p>

        <div className="mt-14 text-left">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center gap-4 py-16 border border-white/10 bg-ash/60"
            >
              <CheckCircle2 className="w-10 h-10 text-glacier-light" strokeWidth={1.5} />
              <p className="font-display text-2xl uppercase text-snow">Заявка принята</p>
              <p className="text-mist text-sm max-w-sm">
                Мы свяжемся с вами по почте или в WhatsApp в течение 24 часов, чтобы назначить
                видео-интервью.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-xs uppercase tracking-wide text-mist mb-2">
                  Имя
                </label>
                <input
                  id="name"
                  required
                  type="text"
                  placeholder="Ваше имя"
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-snow placeholder:text-mist/60 focus:border-glacier-light outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-xs uppercase tracking-wide text-mist mb-2">
                  Страна
                </label>
                <input
                  id="country"
                  required
                  type="text"
                  placeholder="Страна проживания"
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-snow placeholder:text-mist/60 focus:border-glacier-light outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-xs uppercase tracking-wide text-mist mb-2">
                  Возраст
                </label>
                <input
                  id="age"
                  required
                  type="number"
                  min={16}
                  max={90}
                  placeholder="35"
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-snow placeholder:text-mist/60 focus:border-glacier-light outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs uppercase tracking-wide text-mist mb-2">
                  Телефон
                </label>
                <input
                  id="phone"
                  required
                  type="tel"
                  placeholder="+7 999 000-00-00"
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-snow placeholder:text-mist/60 focus:border-glacier-light outline-none transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-xs uppercase tracking-wide text-mist mb-2">
                  E-mail
                </label>
                <input
                  id="email"
                  required
                  type="email"
                  placeholder="you@mail.com"
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-snow placeholder:text-mist/60 focus:border-glacier-light outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="peak" className="block text-xs uppercase tracking-wide text-mist mb-2">
                  Желаемая экспедиция
                </label>
                <select
                  id="peak"
                  defaultValue={expeditions[0].name}
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-snow focus:border-glacier-light outline-none transition-colors"
                >
                  {expeditions.map((exp) => (
                    <option key={exp.name} value={exp.name} className="bg-obsidian">
                      {exp.name} — {exp.altitude}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="level" className="block text-xs uppercase tracking-wide text-mist mb-2">
                  Текущий уровень активности
                </label>
                <select
                  id="level"
                  defaultValue={activityLevels[1]}
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-snow focus:border-glacier-light outline-none transition-colors"
                >
                  {activityLevels.map((l) => (
                    <option key={l} value={l} className="bg-obsidian">
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="experience" className="block text-xs uppercase tracking-wide text-mist mb-2">
                  Опыт восхождений
                </label>
                <select
                  id="experience"
                  defaultValue={experienceLevels[0]}
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-snow focus:border-glacier-light outline-none transition-colors"
                >
                  {experienceLevels.map((l) => (
                    <option key={l} value={l} className="bg-obsidian">
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-xs uppercase tracking-wide text-mist mb-2">
                  Сообщение (необязательно)
                </label>
                <textarea
                  id="message"
                  rows={3}
                  placeholder="Расскажите о своей цели, датах, вопросах…"
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-snow placeholder:text-mist/60 focus:border-glacier-light outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="sm:col-span-2 mt-2 bg-snow text-obsidian px-7 py-4 text-sm tracking-wide font-medium hover:bg-glacier-light transition-colors"
              >
                Отправить заявку
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
