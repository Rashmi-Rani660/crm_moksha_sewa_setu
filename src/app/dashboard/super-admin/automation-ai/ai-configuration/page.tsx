import type { Metadata } from "next";
import AiConfiguration from "@/components/dashboards/super-admin/pages/AiConfiguration";

export const metadata: Metadata = {
  title: "AI Configuration & Quality Testing | Super Admin",
};

export default function Page() {
  return <AiConfiguration />;
}
