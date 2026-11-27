import type { Metadata } from "next";
import SA068ConsentPrivacy from "@/components/dashboards/super-admin/pages/SA068ConsentPrivacy";

export const metadata: Metadata = {
  title: "Consent & Privacy Management (SA-068) | Super Admin",
};

export default function Page() {
  return <SA068ConsentPrivacy />;
}

