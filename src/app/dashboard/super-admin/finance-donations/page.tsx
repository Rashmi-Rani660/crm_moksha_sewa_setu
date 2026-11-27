import type { Metadata } from "next";
import DonationReceipts from "@/components/dashboards/super-admin/pages/DonationReceipts";

export const metadata: Metadata = {
  title: "Donation Receipts & Reconciliation | Super Admin",
};

export default function Page() {
  return <DonationReceipts />;
}
