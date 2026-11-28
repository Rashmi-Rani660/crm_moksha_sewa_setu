import type { Metadata } from "next";
import US016CallingFollowups from "@/components/dashboards/user/pages/US016CallingFollowups";

export const metadata: Metadata = {
  title: "Calling & Follow-ups | User",
};

export default function Page() {
  return <US016CallingFollowups />;
}
