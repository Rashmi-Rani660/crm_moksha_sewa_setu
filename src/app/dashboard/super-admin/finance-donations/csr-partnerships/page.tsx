import type { Metadata } from "next";
import CsrPartnerships from "@/components/dashboards/super-admin/pages/CsrPartnerships";

export const metadata: Metadata = {
  title: "CSR & Partnership Management | Super Admin",
};

export default function Page() {
  return <CsrPartnerships />;
}
