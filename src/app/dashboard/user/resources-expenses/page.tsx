import type { Metadata } from "next";
import US019VehicleMaterialRequests from "@/components/dashboards/user/pages/US019VehicleMaterialRequests";

export const metadata: Metadata = {
  title: "Vehicle & Material Requests | User",
};

export default function Page() {
  return <US019VehicleMaterialRequests />;
}
