import type { Metadata } from "next";
import SA059Performance from "@/components/dashboards/super-admin/pages/SA059Performance";

export const metadata: Metadata = {
  title: "Admin & User Performance | Super Admin",
};

export default function Page() {
  return <SA059Performance />;
}
