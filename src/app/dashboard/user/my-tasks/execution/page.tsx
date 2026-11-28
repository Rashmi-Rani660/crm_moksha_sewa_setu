import type { Metadata } from "next";
import US012TaskExecution from "@/components/dashboards/user/pages/US012TaskExecution";

export const metadata: Metadata = {
  title: "Task Acceptance, Execution & Completion | User",
};

export default function Page() {
  return <US012TaskExecution />;
}
