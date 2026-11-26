import type { Metadata } from "next";
import SA006CityZone from "@/components/dashboards/super-admin/pages/SA006CityZone";

export const metadata: Metadata = {
  title: "City, Zone & Service Centre Management | Super Admin",
};

export default function Page() {
  return <SA006CityZone />;
}
