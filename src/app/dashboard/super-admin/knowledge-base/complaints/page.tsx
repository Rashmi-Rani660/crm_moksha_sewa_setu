import type { Metadata } from "next";
import SA062Complaints from "@/components/dashboards/super-admin/pages/SA062Complaints";

export const metadata: Metadata = {
  title: "Complaints & Grievances (SA-062) | Super Admin",
};

export default function Page() {
  return <SA062Complaints />;
}
