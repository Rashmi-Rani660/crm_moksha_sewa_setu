import type { Metadata } from "next";
import UserDashboard from "@/components/dashboards/UserDashboard";

export const metadata: Metadata = {
  title: "User Dashboard",
};

export default function Page() {
  return <UserDashboard />;
}
