import { getTranslations } from "next-intl/server";
import { Mountain, Instagram, Facebook, MessageCircle, Mail } from "lucide-react";
import { getSiteTheme } from "@/lib/theme-data";

export default async function Footer() {
  const [tNav, tFooter, theme] = await Promise.all([
    getTranslations("nav"),
    getTranslations("footer"),
    getSiteTheme(),
  ]);

  const links = [
    theme.instagramUrl && { href: theme.instagramUrl, label: "Instagram", icon: Instagram },
    theme.facebookUrl && { href: theme.facebookUrl, label: "Facebook", icon: Facebook },
    theme.whatsappNumber && {
      href: `https://wa.me/${theme.whatsappNumber}`,
      label: "WhatsApp",
      icon: MessageCircle,
    },
    theme.contactEmail && { href: `mailto:${theme.contactEmail}`, label: "Email", icon: Mail },
  ].filter((l): l is { href: string; label: string; icon: typeof Instagram } => Boolean(l));

  return (
    <footer className="bg-obsidian border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <a href="#top" className="flex items-center gap-2 font-display text-2xl text-snow">
          <Mountain className="w-5 h-5 text-glacier-light" strokeWidth={1.5} />
          {tNav("brand")}
        </a>

        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-xs text-mist">
          {theme.contactPhone && (
            <a href={`tel:${theme.contactPhone.replace(/[^+\d]/g, "")}`} className="hover:text-glacier-light transition-colors">
              {theme.contactPhone}
            </a>
          )}
          {links.length > 0 && (
            <div className="flex gap-5">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={l.label}
                  className="text-mist hover:text-glacier-light transition-colors"
                >
                  <l.icon className="w-5 h-5" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          )}
        </div>

        <span className="font-mono text-xs text-mist">
          © {new Date().getFullYear()} {tNav("brand")} · {tFooter("location")}
        </span>
      </div>
    </footer>
  );
}
