import type { Metadata } from "next";
import { US001MyWorkDashboard } from "@/components/dashboards/user/us/screens-a";

export const metadata: Metadata = {
  title: "My Work Dashboard | User",
};

export default function Page() {
  return <US001MyWorkDashboard />;
}
