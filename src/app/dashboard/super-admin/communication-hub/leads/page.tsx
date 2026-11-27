import type { Metadata } from "next";
import SA036SocialLeads from "@/components/dashboards/super-admin/pages/SA036SocialLeads";

export const metadata: Metadata = {
  title: "Social Media & Google Ads Leads | Super Admin",
};

export default function Page() {
  return <SA036SocialLeads />;
}
