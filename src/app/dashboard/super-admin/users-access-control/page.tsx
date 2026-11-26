import type { Metadata } from "next";
import SA008Users from "@/components/dashboards/super-admin/pages/SA008Users";

export const metadata: Metadata = {
  title: "Admin & User Management | Super Admin",
};

export default function Page() {
  return <SA008Users />;
}
