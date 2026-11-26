import type { Metadata } from "next";
import SA003Notifications from "@/components/dashboards/super-admin/pages/SA003Notifications";

export const metadata: Metadata = {
  title: "Notification & Alert Centre | Super Admin",
};

export default function Page() {
  return <SA003Notifications />;
}
