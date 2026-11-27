import type { Metadata } from "next";
import SA051AiCostUsage from "@/components/dashboards/super-admin/pages/SA051AiCostUsage";

export const metadata: Metadata = {
  title: "AI Cost & Usage Control | Super Admin",
};

export default function Page() {
  return <SA051AiCostUsage />;
}
