import type { Metadata } from "next";
import SA012MasterData from "@/components/dashboards/super-admin/pages/SA012MasterData";

export const metadata: Metadata = {
  title: "Master Data Management | Super Admin",
};

export default function Page() {
  return <SA012MasterData />;
}
