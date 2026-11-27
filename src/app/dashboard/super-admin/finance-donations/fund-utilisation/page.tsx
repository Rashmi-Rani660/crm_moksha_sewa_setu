import type { Metadata } from "next";
import FundUtilisation from "@/components/dashboards/super-admin/pages/FundUtilisation";

export const metadata: Metadata = {
  title: "Fund Utilisation & Transparency | Super Admin",
};

export default function Page() {
  return <FundUtilisation />;
}
