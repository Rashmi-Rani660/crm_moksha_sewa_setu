import { redirect } from "next/navigation";

/** Top-bar link ("my-profile") opens the user's own screen. */
export default function Page() {
  redirect("/dashboard/user/my-profile-hrms");
}
