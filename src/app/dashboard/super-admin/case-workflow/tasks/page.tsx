import type { Metadata } from "next";
import SA017Tasks from "@/components/dashboards/super-admin/pages/SA017Tasks";

export const metadata: Metadata = {
  title: "Task Management | Super Admin",
};

export default function Page() {
  return <SA017Tasks />;
}
