import type { Metadata } from "next";
import SA037TeamWorkspace from "@/components/dashboards/super-admin/pages/SA037TeamWorkspace";

export const metadata: Metadata = {
  title: "Internal Team Workspace | Super Admin",
};

export default function Page() {
  return <SA037TeamWorkspace />;
}
