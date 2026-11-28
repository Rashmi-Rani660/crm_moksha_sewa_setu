import type { Metadata } from "next";
import US014OfficialEmail from "@/components/dashboards/user/pages/US014OfficialEmail";

export const metadata: Metadata = {
  title: "Official Email Workspace | User",
};

export default function Page() {
  return <US014OfficialEmail />;
}
