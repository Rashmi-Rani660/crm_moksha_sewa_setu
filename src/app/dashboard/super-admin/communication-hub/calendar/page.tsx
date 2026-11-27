import type { Metadata } from "next";
import SA038CalendarMeetings from "@/components/dashboards/super-admin/pages/SA038CalendarMeetings";

export const metadata: Metadata = {
  title: "Calendar & Meetings | Super Admin",
};

export default function Page() {
  return <SA038CalendarMeetings />;
}
