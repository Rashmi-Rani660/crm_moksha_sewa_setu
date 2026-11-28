import type { Metadata } from "next";
import { US009CaseDetails } from "@/components/dashboards/user/us/screens-b";

export const metadata: Metadata = {
  title: "Case Details, Progress & Escalation | User",
};

export default function Page() {
  return <US009CaseDetails />;
}
