import type { Metadata } from "next";
import SA001Dashboard from "@/components/dashboards/super-admin/pages/SA001Dashboard";

export const metadata: Metadata = {
  title: "Super Admin Dashboard",
};

export default function Page() {
  return <SA001Dashboard />;
}
