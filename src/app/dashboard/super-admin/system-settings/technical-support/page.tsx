import type { Metadata } from "next";
import SaScreen from "@/components/dashboards/super-admin/pages/sa07x/SaScreen";

export const metadata: Metadata = {
  title: "Technical Support & Issue Tracking | Super Admin",
};

export default function Page() {
  return <SaScreen id="SA-076" />;
}
