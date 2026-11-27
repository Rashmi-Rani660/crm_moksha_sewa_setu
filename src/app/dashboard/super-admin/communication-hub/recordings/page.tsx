import type { Metadata } from "next";
import SA033CallRecordings from "@/components/dashboards/super-admin/pages/SA033CallRecordings";

export const metadata: Metadata = {
  title: "Call Recordings, Transcripts & History | Super Admin",
};

export default function Page() {
  return <SA033CallRecordings />;
}
