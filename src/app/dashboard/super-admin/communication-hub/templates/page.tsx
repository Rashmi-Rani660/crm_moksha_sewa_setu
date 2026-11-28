import type { Metadata } from "next";
import SA052CommunicationTemplates from "@/components/dashboards/super-admin/pages/SA052CommunicationTemplates";

export const metadata: Metadata = {
  title: "Notification & Communication Templates | Super Admin",
};

export default function Page() {
  return <SA052CommunicationTemplates />;
}
