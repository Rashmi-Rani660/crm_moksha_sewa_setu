import type { Metadata } from "next";
import SA065DeviceManagement from "@/components/dashboards/super-admin/pages/SA065DeviceManagement";

export const metadata: Metadata = {
  title: "Device & Access Management (SA-065) | Super Admin",
};

export default function Page() {
  return <SA065DeviceManagement />;
}
