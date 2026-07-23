import Link from "next/link";
import { Mountain, Inbox, BarChart3 } from "lucide-react";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = createAdminSupabaseClient();

  const [{ count: expeditionsCount }, { count: publishedCount }, { count: applicationsCount }, { count: newApplicationsCount }] =
    await Promise.all([
      supabase.from("expeditions").select("*", { count: "exact", head: true }),
      supabase.from("expeditions").select("*", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("applications").select("*", { count: "exact", head: true }),
      supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "NEW"),
    ]);

  const cards = [
    {
      label: "Экспедиций всего",
      value: expeditionsCount ?? 0,
      sub: `${publishedCount ?? 0} опубликовано`,
      icon: Mountain,
      href: "/admin/expeditions",
    },
    {
      label: "Заявок всего",
      value: applicationsCount ?? 0,
      sub: `${newApplicationsCount ?? 0} новых`,
      icon: Inbox,
      href: "/admin/applications",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-8">Dashboard</h1>

      <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="border border-white/10 p-6 hover:border-glacier-light/40 transition-colors"
            >
              <Icon className="w-5 h-5 text-glacier-light mb-4" strokeWidth={1.5} />
              <div className="font-mono text-3xl text-snow">{c.value}</div>
              <div className="text-sm text-mist mt-1">{c.label}</div>
              <div className="text-xs text-mist/70 mt-2">{c.sub}</div>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 flex items-center gap-2 text-mist text-sm">
        <BarChart3 className="w-4 h-4" />
        Дальше в CMS: фотографии, истории экспедиций, команда, FAQ, настройки сайта.
      </div>
    </div>
  );
}
