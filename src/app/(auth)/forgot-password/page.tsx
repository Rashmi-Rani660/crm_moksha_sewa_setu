import type { Metadata } from "next";
import AuthHero from "@/components/auth/AuthHero";
import AuthShell from "@/components/auth/AuthShell";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell variant="login">
      <AuthHero variant="login" />
      <ForgotPasswordForm />
    </AuthShell>
  );
}
