import type { Metadata } from "next";
import SA063SecurityCommand from "@/components/dashboards/super-admin/pages/SA063SecurityCommand";

export const metadata: Metadata = {
  title: "Security Command Centre (SA-063) | Super Admin",
};

export default function Page() {
  return <SA063SecurityCommand />;
}

