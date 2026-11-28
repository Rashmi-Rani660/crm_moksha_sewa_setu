import type { Metadata } from "next";
import { US006CreateRequest } from "@/components/dashboards/user/us/screens-b";

export const metadata: Metadata = {
  title: "Create & Update Sewa Request | User",
};

export default function Page() {
  return <US006CreateRequest />;
}
