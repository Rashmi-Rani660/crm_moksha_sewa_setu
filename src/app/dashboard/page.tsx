import type { Metadata } from "next";
import RoleRedirect from "@/components/dashboards/RoleRedirect";

export const metadata: Metadata = {
  title: "Dashboard",
};

/** Sends the signed-in person to the dashboard for their role. */
export default function DashboardPage() {
  return <RoleRedirect />;
}
