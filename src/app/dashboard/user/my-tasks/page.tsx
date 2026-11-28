import type { Metadata } from "next";
import US011MyTasks from "@/components/dashboards/user/pages/US011MyTasks";

export const metadata: Metadata = {
  title: "My Tasks | User",
};

export default function Page() {
  return <US011MyTasks />;
}
