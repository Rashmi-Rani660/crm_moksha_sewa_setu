import type { Metadata } from "next";
import US022Assessment from "@/components/dashboards/user/pages/US022Assessment";

export const metadata: Metadata = {
  title: "Assessment & Certification | User",
};

export default function Page() {
  return <US022Assessment />;
}
