import type { Metadata } from "next";
import SA005OrganisationSetup from "@/components/dashboards/super-admin/pages/SA005OrganisationSetup";

export const metadata: Metadata = {
  title: "Organisation Setup | Super Admin",
};

export default function Page() {
  return <SA005OrganisationSetup />;
}
