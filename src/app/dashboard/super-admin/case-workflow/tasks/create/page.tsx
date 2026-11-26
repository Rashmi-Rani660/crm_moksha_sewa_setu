import type { Metadata } from "next";
import SA018CreateTask from "@/components/dashboards/super-admin/pages/SA018CreateTask";

export const metadata: Metadata = {
  title: "Create & Assign Task | Super Admin",
};

export default function Page() {
  return <SA018CreateTask />;
}
