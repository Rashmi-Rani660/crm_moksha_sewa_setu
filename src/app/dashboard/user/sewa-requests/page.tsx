import type { Metadata } from "next";
import { US005SewaRequests } from "@/components/dashboards/user/us/screens-a";

export const metadata: Metadata = {
  title: "Sewa Requests & Digital Leads | User",
};

export default function Page() {
  return <US005SewaRequests />;
}
