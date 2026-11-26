import type { Metadata } from "next";
import SA009CreateUser from "@/components/dashboards/super-admin/pages/SA009CreateUser";

export const metadata: Metadata = {
  title: "Create User & Assign Access | Super Admin",
};

export default function Page() {
  return <SA009CreateUser />;
}
