import type { Metadata } from "next";
import AuthHero from "@/components/auth/AuthHero";
import AuthShell from "@/components/auth/AuthShell";
import VerifyDeviceForm from "@/components/auth/VerifyDeviceForm";

export const metadata: Metadata = {
  title: "New Device Verification",
};

export default function VerifyDevicePage() {
  return (
    <AuthShell variant="verify">
      <AuthHero variant="verify" />
      <VerifyDeviceForm />
    </AuthShell>
  );
}
