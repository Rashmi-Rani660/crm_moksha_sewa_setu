import type { Metadata } from "next";
import SA053AiSmartSearch from "@/components/dashboards/super-admin/pages/SA053AiSmartSearch";

export const metadata: Metadata = {
  title: "AI Universal Smart Search | Super Admin",
};

export default function Page() {
  return <SA053AiSmartSearch />;
}
