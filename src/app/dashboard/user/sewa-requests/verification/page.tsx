import type { Metadata } from "next";
import { US007Verification } from "@/components/dashboards/user/us/screens-b";

export const metadata: Metadata = {
  title: "Verification & Documents | User",
};

export default function Page() {
  return <US007Verification />;
}
