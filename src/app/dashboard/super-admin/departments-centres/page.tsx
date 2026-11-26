import type { Metadata } from "next";
import SA007Departments from "@/components/dashboards/super-admin/pages/SA007Departments";

export const metadata: Metadata = {
  title: "Organisation & Department Management | Super Admin",
};

export default function Page() {
  return <SA007Departments />;
}
