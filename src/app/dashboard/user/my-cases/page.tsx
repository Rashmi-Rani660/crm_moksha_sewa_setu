import type { Metadata } from "next";
import { US008MyCases } from "@/components/dashboards/user/us/screens-b";

export const metadata: Metadata = {
  title: "My Assigned Cases | User",
};

export default function Page() {
  return <US008MyCases />;
}
