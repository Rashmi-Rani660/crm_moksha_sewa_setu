import type { Metadata } from "next";
import SA061KnowledgeBase from "@/components/dashboards/super-admin/pages/SA061KnowledgeBase";

export const metadata: Metadata = {
  title: "Knowledge Base & SOP Management (SA-061) | Super Admin",
};

export default function Page() {
  return <SA061KnowledgeBase />;
}

