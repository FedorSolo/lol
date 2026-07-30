import { requireAdmin } from "../auth-actions";
import AdminSidebar from "./AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-obsidian flex flex-col md:flex-row">
      <AdminSidebar userEmail={user.email ?? ""} />
      <main className="flex-1 px-5 py-8 md:px-10 md:py-10 max-w-6xl w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
