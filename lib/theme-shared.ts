export interface SiteTheme {
  backgroundColor: string;
  accentColor: string;
  fontDisplay: string;
  fontBody: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  heroPosterUrl: string;
  whyPhotoUrl: string;
  contactPhotoUrl: string;
}

export const DEFAULT_THEME: SiteTheme = {
  backgroundColor: "#0A0C0F",
  accentColor: "#3E6C8E",
  fontDisplay: "default",
  fontBody: "default",
  contactEmail: "",
  contactPhone: "",
  whatsappNumber: "",
  instagramUrl: "",
  facebookUrl: "",
  heroPosterUrl:
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2400&auto=format&fit=crop",
  whyPhotoUrl:
    "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=1200&auto=format&fit=crop",
  contactPhotoUrl:
    "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=2400&auto=format&fit=crop",
};
