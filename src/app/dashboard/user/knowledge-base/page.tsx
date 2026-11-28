import type { Metadata } from "next";
import US024KnowledgeBase from "@/components/dashboards/user/pages/US024KnowledgeBase";

export const metadata: Metadata = {
  title: "Knowledge Base & SOPs | User",
};

export default function Page() {
  return <US024KnowledgeBase />;
}
