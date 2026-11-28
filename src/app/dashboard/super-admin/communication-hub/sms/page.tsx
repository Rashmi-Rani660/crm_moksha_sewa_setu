import type { Metadata } from "next";
import SA035OutgoingSms from "@/components/dashboards/super-admin/pages/SA035OutgoingSms";

export const metadata: Metadata = {
  title: "Outgoing SMS Management | Super Admin",
};

export default function Page() {
  return <SA035OutgoingSms />;
}
