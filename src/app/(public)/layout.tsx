import { getSessionCookie } from "@/lib/server/auth"
import { redirect } from "next/navigation";
import { ReactNode } from "react"

async function layout({children}: {children: ReactNode}) {
    const session = await getSessionCookie()
    if(session) redirect("/dashboard");
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
      {children}
      </div>
    </div>
  )
}

export default layout