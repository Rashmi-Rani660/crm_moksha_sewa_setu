import type { Metadata } from "next";
import { US010CaseCompletion } from "@/components/dashboards/user/us/screens-b";

export const metadata: Metadata = {
  title: "Case Completion, Evidence & Feedback | User",
};

export default function Page() {
  return <US010CaseCompletion />;
}
