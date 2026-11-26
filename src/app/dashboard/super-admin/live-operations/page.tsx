import type { Metadata } from "next";
import SA002LiveOperations from "@/components/dashboards/super-admin/pages/SA002LiveOperations";

export const metadata: Metadata = {
  title: "Live Operations & Emergency Control | Super Admin",
};

export default function Page() {
  return <SA002LiveOperations />;
}
