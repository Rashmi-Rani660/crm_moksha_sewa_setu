import type { Metadata } from "next";
import US017AiChatbot from "@/components/dashboards/user/pages/US017AiChatbot";

export const metadata: Metadata = {
  title: "AI Chatbot & Human Assistance | User",
};

export default function Page() {
  return <US017AiChatbot />;
}
