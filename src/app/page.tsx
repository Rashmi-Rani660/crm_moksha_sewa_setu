import { redirect } from "next/navigation";

// There is no dashboard yet — send visitors to the login screen.
export default function Home() {
  redirect("/login");
}
