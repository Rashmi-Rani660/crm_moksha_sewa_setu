import type { Metadata } from "next";
import SA014RequestDetails from "@/components/dashboards/super-admin/pages/SA014RequestDetails";

export const metadata: Metadata = {
  title: "Sewa Request Details & Verification | Super Admin",
};

export default function Page() {
  return <SA014RequestDetails />;
}
