import type { Metadata } from "next";
import SA031InboundCalling from "@/components/dashboards/super-admin/pages/SA031InboundCalling";

export const metadata: Metadata = {
  title: "AI Inbound Calling Centre | Super Admin",
};

export default function Page() {
  return <SA031InboundCalling />;
}
