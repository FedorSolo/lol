import Link from "next/link";
import { Mountain, User, Compass, LogOut } from "lucide-react";
import { requireClient, clientSignOutAction } from "./auth-actions";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireClient();

  return (
    <div className="min-h-screen bg-obsidian">
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/account" className="flex items-center gap-2 font-display text-lg text-snow tracking-wide">
            <Mountain className="w-5 h-5 text-glacier-light" strokeWidth={1.5} />
            CUMBRE
          </Link>
          <nav className="flex items-center gap-6 text-sm text-mist">
            <Link href="/account" className="hover:text-snow flex items-center gap-1.5">
              <User className="w-4 h-4" strokeWidth={1.5} />
              Профиль
            </Link>
            <Link href="/account/trip" className="hover:text-snow flex items-center gap-1.5">
              <Compass className="w-4 h-4" strokeWidth={1.5} />
              Моя экспедиция
            </Link>
            <form action={clientSignOutAction}>
              <button type="submit" className="hover:text-snow flex items-center gap-1.5">
                <LogOut className="w-4 h-4" strokeWidth={1.5} />
                Выйти
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
