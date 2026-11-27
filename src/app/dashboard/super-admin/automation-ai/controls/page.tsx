import type { Metadata } from "next";
import AutomationControls from "@/components/dashboards/super-admin/pages/AutomationControls";

export const metadata: Metadata = {
  title: "Automatic / Manual / Approval Controls | Super Admin",
};

export default function Page() {
  return <AutomationControls />;
}
