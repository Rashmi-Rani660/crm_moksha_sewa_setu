import type { Metadata } from "next";
import US023Performance from "@/components/dashboards/user/pages/US023Performance";

export const metadata: Metadata = {
  title: "My Performance & Recognition | User",
};

export default function Page() {
  return <US023Performance />;
}
