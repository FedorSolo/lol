import Link from "next/link";
import {
  LayoutDashboard,
  Mountain,
  BarChart3,
  Image as ImageIcon,
  Users,
  HelpCircle,
  FileText,
  Inbox,
  Settings,
  LogOut,
} from "lucide-react";
import { requireAdmin, signOutAction } from "../auth-actions";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/expeditions", label: "Экспедиции", icon: Mountain },
  { href: "/admin/difficulty-levels", label: "Уровни сложности", icon: BarChart3 },
  { href: "/admin/photos", label: "Фотографии", icon: ImageIcon },
  { href: "/admin/stories", label: "Истории экспедиций", icon: FileText },
  { href: "/admin/team", label: "Команда", icon: Users },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/applications", label: "Заявки", icon: Inbox },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-obsidian flex">
      <aside className="w-64 shrink-0 border-r border-white/10 flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <span className="font-display text-xl text-snow tracking-wide">CUMBRE ADMIN</span>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-mist hover:text-snow hover:bg-ash rounded-md transition-colors"
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <p className="px-3 text-xs text-mist truncate mb-2">{user.email}</p>
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-mist hover:text-snow hover:bg-ash rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              Выйти
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 px-10 py-10 max-w-6xl">{children}</main>
    </div>
  );
}
