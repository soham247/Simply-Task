import { createSessionClient } from "@/lib/server/appwrite";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async(
    req: NextRequest, 
    { params }: { params: { teamId: string; membershipId: string } }
) => {
    try {
        const sessionCookie = req.cookies.get('session')?.value;
        
        if (!sessionCookie) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const { teams } = createSessionClient(sessionCookie);
        const result = await teams.deleteMembership(params.teamId, params.membershipId);
        
        return NextResponse.json({ success: true, result }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = (error as Error).message || 'Something went wrong';
        
        if (errorMessage.includes('Invalid session') || errorMessage.includes('Missing session')) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}