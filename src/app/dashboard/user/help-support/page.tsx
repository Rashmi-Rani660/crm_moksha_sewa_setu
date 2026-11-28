import type { Metadata } from "next";
import US025DailyReports from "@/components/dashboards/user/pages/US025DailyReports";

export const metadata: Metadata = {
  title: "Daily Reports, Settings & Support | User",
};

export default function Page() {
  return <US025DailyReports />;
}
