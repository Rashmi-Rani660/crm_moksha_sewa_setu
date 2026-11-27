import type { Metadata } from "next";
import SmartAssignment from "@/components/dashboards/super-admin/pages/SmartAssignment";

export const metadata: Metadata = {
  title: "AI Smart Assignment Management | Super Admin",
};

export default function Page() {
  return <SmartAssignment />;
}
