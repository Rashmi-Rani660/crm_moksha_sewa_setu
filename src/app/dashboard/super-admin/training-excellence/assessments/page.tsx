import type { Metadata } from "next";
import SA058Assessments from "@/components/dashboards/super-admin/pages/SA058Assessments";

export const metadata: Metadata = {
  title: "Assessment & Certification | Super Admin",
};

export default function Page() {
  return <SA058Assessments />;
}
