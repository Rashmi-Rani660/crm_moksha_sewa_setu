import type { Metadata } from "next";
import { US003Notifications } from "@/components/dashboards/user/us/screens-a";

export const metadata: Metadata = {
  title: "Notifications & Admin Instructions | User",
};

export default function Page() {
  return <US003Notifications />;
}
