import { getCurrentUser, logout } from "@/lib/server/auth";
import { redirect } from "next/navigation";

async function handleLogout() {
    "use server";
    
    try {
        await logout();
        redirect("/signin");
    } catch (error) {
        console.error("Logout error:", error);
    }
}

export default async function AccountPage() {
    const userResult = await getCurrentUser();
    
    if (!userResult.success) {
        redirect("/signin");
    }

    const user = userResult.user;

    return (
        <div>
            <h1>Account</h1>
            <p>Welcome, {user?.name}!</p>
            <p>Email: {user?.email}</p>
            <form action={handleLogout}>
                <button type="submit">Logout</button>
            </form>
        </div>
    );
}
