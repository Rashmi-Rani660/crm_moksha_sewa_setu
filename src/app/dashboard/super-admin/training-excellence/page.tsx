import type { Metadata } from "next";
import SA054TrainingAcademy from "@/components/dashboards/super-admin/pages/SA054TrainingAcademy";

export const metadata: Metadata = {
  title: "AI Training Academy Dashboard | Super Admin",
};

export default function Page() {
  return <SA054TrainingAcademy />;
}
