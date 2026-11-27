import type { Metadata } from "next";
import SA057VirtualTrainer from "@/components/dashboards/super-admin/pages/SA057VirtualTrainer";

export const metadata: Metadata = {
  title: "AI Virtual Trainer Configuration | Super Admin",
};

export default function Page() {
  return <SA057VirtualTrainer />;
}
