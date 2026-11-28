import type { Metadata } from "next";
import US018AiSmartSearch from "@/components/dashboards/user/pages/US018AiSmartSearch";

export const metadata: Metadata = {
  title: "AI Smart Search & Work Assistant | User",
};

export default function Page() {
  return <US018AiSmartSearch />;
}
