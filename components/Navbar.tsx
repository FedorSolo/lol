import { getSiteTheme } from "@/lib/theme-data";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const theme = await getSiteTheme();
  return <NavbarClient whatsappNumber={theme.whatsappNumber} contactPhone={theme.contactPhone} />;
}
