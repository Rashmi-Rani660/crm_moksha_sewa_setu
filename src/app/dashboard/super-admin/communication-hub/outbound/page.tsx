import type { Metadata } from "next";
import SA032OutboundCalling from "@/components/dashboards/super-admin/pages/SA032OutboundCalling";

export const metadata: Metadata = {
  title: "AI Outbound Calling Centre | Super Admin",
};

export default function Page() {
  return <SA032OutboundCalling />;
}
