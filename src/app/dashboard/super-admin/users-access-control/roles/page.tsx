import type { Metadata } from "next";
import SA010RolesPermissions from "@/components/dashboards/super-admin/pages/SA010RolesPermissions";

export const metadata: Metadata = {
  title: "Roles & Permission Matrix | Super Admin",
};

export default function Page() {
  return <SA010RolesPermissions />;
}
