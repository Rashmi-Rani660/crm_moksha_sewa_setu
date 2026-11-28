import type { Metadata } from "next";
import US013CommunicationHub from "@/components/dashboards/user/pages/US013CommunicationHub";

export const metadata: Metadata = {
  title: "Communication & Collaboration Hub | User",
};

export default function Page() {
  return <US013CommunicationHub />;
}
