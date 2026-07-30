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
  PenLine,
} from "lucide-react";
import { requireAdmin } from "../auth-actions";
import AdminSidebar from "./AdminSidebar";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/expeditions", label: "Экспедиции", icon: Mountain },
  { href: "/admin/difficulty-levels", label: "Уровни сложности", icon: BarChart3 },
  { href: "/admin/content", label: "Тексты главной", icon: PenLine },
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
    <div className="min-h-screen bg-obsidian flex flex-col md:flex-row">
      <AdminSidebar nav={nav} userEmail={user.email ?? ""} />
      <main className="flex-1 px-5 py-8 md:px-10 md:py-10 max-w-6xl w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
