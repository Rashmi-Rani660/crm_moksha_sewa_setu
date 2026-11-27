import type { Metadata } from "next";
import SA067ExportControl from "@/components/dashboards/super-admin/pages/SA067ExportControl";

export const metadata: Metadata = {
  title: "Data Access & Export Control (SA-067) | Super Admin",
};

export default function Page() {
  return <SA067ExportControl />;
}

