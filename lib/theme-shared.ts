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
};
