import type { Metadata } from "next";
import RuleBuilder from "@/components/dashboards/super-admin/pages/RuleBuilder";

export const metadata: Metadata = {
  title: "Automation Rule Builder | Super Admin",
};

export default function Page() {
  return <RuleBuilder />;
}
