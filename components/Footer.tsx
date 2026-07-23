import { useTranslations } from "next-intl";
import { Mountain, Instagram, MessageCircle, Send, Mail } from "lucide-react";

export default function Footer() {
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");

  return (
    <footer className="bg-obsidian border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <a href="#top" className="flex items-center gap-2 font-display text-2xl text-snow">
          <Mountain className="w-5 h-5 text-glacier-light" strokeWidth={1.5} />
          {tNav("brand")}
        </a>

        <div className="flex gap-6">
          <a href="#" aria-label="Instagram" className="text-mist hover:text-glacier-light transition-colors">
            <Instagram className="w-5 h-5" strokeWidth={1.5} />
          </a>
          <a href="#" aria-label="WhatsApp" className="text-mist hover:text-glacier-light transition-colors">
            <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
          </a>
          <a href="#" aria-label="Telegram" className="text-mist hover:text-glacier-light transition-colors">
            <Send className="w-5 h-5" strokeWidth={1.5} />
          </a>
          <a href="#" aria-label="Email" className="text-mist hover:text-glacier-light transition-colors">
            <Mail className="w-5 h-5" strokeWidth={1.5} />
          </a>
        </div>

        <span className="font-mono text-xs text-mist">
          © {new Date().getFullYear()} {tNav("brand")} · {tFooter("location")}
        </span>
      </div>
    </footer>
  );
}
