import type { Metadata } from "next";
import SA020SlaEscalation from "@/components/dashboards/super-admin/pages/SA020SlaEscalation";

export const metadata: Metadata = {
  title: "SLA & Escalation Management | Super Admin",
};

export default function Page() {
  return <SA020SlaEscalation />;
}
