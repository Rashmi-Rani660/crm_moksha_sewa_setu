import type { Metadata } from "next";
import SA055CourseManagement from "@/components/dashboards/super-admin/pages/SA055CourseManagement";

export const metadata: Metadata = {
  title: "Course & Training Module Management | Super Admin",
};

export default function Page() {
  return <SA055CourseManagement />;
}
