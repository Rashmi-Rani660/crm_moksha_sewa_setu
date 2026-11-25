import type { Metadata } from "next";
import AuthHero from "@/components/auth/AuthHero";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <AuthShell variant="login">
      <AuthHero variant="login" />
      <LoginForm />
    </AuthShell>
  );
}
