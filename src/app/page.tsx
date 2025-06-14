import { getSessionCookie } from "@/lib/server/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSessionCookie()
  if(!!session) redirect("/dashboard");
  redirect("/signin");

  return (
    <div>Home</div>
  )
}
