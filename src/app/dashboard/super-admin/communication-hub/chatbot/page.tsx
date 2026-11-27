import type { Metadata } from "next";
import SA034ChatbotManagement from "@/components/dashboards/super-admin/pages/SA034ChatbotManagement";

export const metadata: Metadata = {
  title: "AI Chatbot Management | Super Admin",
};

export default function Page() {
  return <SA034ChatbotManagement />;
}
