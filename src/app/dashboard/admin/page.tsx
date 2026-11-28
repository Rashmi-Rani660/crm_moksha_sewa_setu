import type { Metadata } from "next";
import AdScreen from "@/components/dashboards/admin/AdScreen";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

/** AD-001 — Admin Dashboard. */
export default function Page() {
  return <AdScreen code="AD-001" />;
}
