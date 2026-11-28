import { redirect } from "next/navigation";

/** Top-bar link ("notifications") opens the user's own screen. */
export default function Page() {
  redirect("/dashboard/user/notifications-instructions");
}
