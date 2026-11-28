import type { Metadata } from "next";
import { US002WorkPlanner } from "@/components/dashboards/user/us/screens-a";

export const metadata: Metadata = {
  title: "Work Planner, Calendar & Handover | User",
};

export default function Page() {
  return <US002WorkPlanner />;
}
