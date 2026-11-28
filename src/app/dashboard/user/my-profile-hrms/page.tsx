import type { Metadata } from "next";
import { US004MyProfile } from "@/components/dashboards/user/us/screens-a";

export const metadata: Metadata = {
  title: "My Profile, Attendance & HRMS | User",
};

export default function Page() {
  return <US004MyProfile />;
}
