import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackToContentHub() {
  return (
    <Link
      href="/admin/content-hub"
      className="inline-flex items-center gap-1.5 text-xs text-mist hover:text-glacier-light transition-colors mb-4"
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      Назад к контенту
    </Link>
  );
}
