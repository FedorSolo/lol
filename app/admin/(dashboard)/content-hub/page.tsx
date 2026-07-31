import Link from "next/link";
import { PenLine, BarChart3, Image as ImageIcon, FileText, Users, HelpCircle, Star, Newspaper } from "lucide-react";

const sections = [
  {
    href: "/admin/content",
    label: "Тексты главной страницы",
    description: "Hero, философия, «почему мы», таймлайн подготовки, «кому подходит», процесс отбора",
    icon: PenLine,
  },
  {
    href: "/admin/difficulty-levels",
    label: "Уровни сложности",
    description: "Названия и описания уровней (Начальный / Средний / Экстремальный и т.п.)",
    icon: BarChart3,
  },
  {
    href: "/admin/photos",
    label: "Фотографии",
    description: "Обложки и галереи экспедиций",
    icon: ImageIcon,
  },
  {
    href: "/admin/stories",
    label: "Истории экспедиций",
    description: "Фотоистории прошедших восхождений",
    icon: FileText,
  },
  {
    href: "/admin/articles",
    label: "Статьи",
    description: "Блог — подготовка, снаряжение, статьи о горах",
    icon: Newspaper,
  },
  {
    href: "/admin/team",
    label: "Команда",
    description: "Гиды и тренеры — фото, роли, биографии",
    icon: Users,
  },
  {
    href: "/admin/testimonials",
    label: "Отзывы",
    description: "Отзывы клиентов с фото и оценкой — на главной странице",
    icon: Star,
  },
  {
    href: "/admin/faq",
    label: "FAQ",
    description: "Общие вопросы и ответы на главной странице",
    icon: HelpCircle,
  },
];

export default function ContentHubPage() {
  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-2">Контент</h1>
      <p className="text-mist text-sm max-w-lg mb-10">
        Выберите, что хотите отредактировать. Экспедиции и заявки — в отдельных разделах меню
        слева.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="border border-white/10 p-6 hover:border-glacier-light/40 transition-colors"
            >
              <Icon className="w-6 h-6 text-glacier-light mb-4" strokeWidth={1.5} />
              <h2 className="font-display text-lg uppercase text-snow tracking-wide mb-1.5">
                {section.label}
              </h2>
              <p className="text-mist text-sm leading-relaxed">{section.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
