import type { Metadata } from "next";
import US015WhatsAppDesk from "@/components/dashboards/user/pages/US015WhatsAppDesk";

export const metadata: Metadata = {
  title: "WhatsApp Business Desk | User",
};

export default function Page() {
  return <US015WhatsAppDesk />;
}
