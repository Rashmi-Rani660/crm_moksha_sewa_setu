import type { Metadata } from "next";
import SA056RoleTraining from "@/components/dashboards/super-admin/pages/SA056RoleTraining";

export const metadata: Metadata = {
  title: "Role-wise Training Assignment | Super Admin",
};

export default function Page() {
  return <SA056RoleTraining />;
}
