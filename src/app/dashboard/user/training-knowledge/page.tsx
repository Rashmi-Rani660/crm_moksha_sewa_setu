import type { Metadata } from "next";
import US021MyTraining from "@/components/dashboards/user/pages/US021MyTraining";

export const metadata: Metadata = {
  title: "My Training & AI Virtual Trainer | User",
};

export default function Page() {
  return <US021MyTraining />;
}
