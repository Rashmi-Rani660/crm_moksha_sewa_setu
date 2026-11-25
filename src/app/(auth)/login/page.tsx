import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";
import LoginHero from "@/components/auth/LoginHero";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <AuthShell>
      <LoginHero />
      <LoginForm />
    </AuthShell>
  );
}
