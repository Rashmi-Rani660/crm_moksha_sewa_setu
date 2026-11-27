import type { Metadata } from "next";
import SaScreen2 from "@/components/dashboards/super-admin/pages/sa02x/SaScreen2";

export const metadata: Metadata = {
  title: "Official Email Workspace | Super Admin",
};

export default function Page() {
  return <SaScreen2 id="SA-027" />;
}
