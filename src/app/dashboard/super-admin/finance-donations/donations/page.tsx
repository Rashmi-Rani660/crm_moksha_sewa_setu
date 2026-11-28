import type { Metadata } from "next";
import SA040DonationsManagement from "@/components/dashboards/super-admin/pages/SA040DonationsManagement";

export const metadata: Metadata = {
  title: "Donations & Donor Management | Super Admin",
};

export default function Page() {
  return <SA040DonationsManagement />;
}
