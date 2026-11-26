import type { Metadata } from "next";
import SA019WorkflowBuilder from "@/components/dashboards/super-admin/pages/SA019WorkflowBuilder";

export const metadata: Metadata = {
  title: "Task Templates & Workflow Builder | Super Admin",
};

export default function Page() {
  return <SA019WorkflowBuilder />;
}
