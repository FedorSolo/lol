"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, type LucideIcon } from "lucide-react";
import { signOutAction } from "../auth-actions";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export default function AdminSidebar({ nav, userEmail }: { nav: NavItem[]; userEmail: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const sidebarContent = (
    <>
      <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
        <span className="font-display text-xl text-snow tracking-wide">CUMBRE ADMIN</span>
        <button
          className="md:hidden text-mist hover:text-snow"
          onClick={() => setOpen(false)}
          aria-label="Закрыть меню"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-colors ${
                active ? "text-snow bg-ash" : "text-mist hover:text-snow hover:bg-ash"
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <p className="px-3 text-xs text-mist truncate mb-2">{userEmail}</p>
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
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 h-14 border-b border-white/10 bg-obsidian sticky top-0 z-30">
        <span className="font-display text-lg text-snow tracking-wide">CUMBRE ADMIN</span>
        <button
          onClick={() => setOpen(true)}
          aria-label="Открыть меню"
          className="text-snow p-1"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 border-r border-white/10 flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-obsidian/70" onClick={() => setOpen(false)} />
          <aside className="relative z-10 w-72 max-w-[80vw] bg-obsidian border-r border-white/10 flex flex-col h-full">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
