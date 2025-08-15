import { createSessionClient } from "@/lib/server/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

export const GET = async(req: NextRequest, { params }: { params: { teamId: string } }) => {
    try {
        const sessionCookie = req.cookies.get('session')?.value;
        
        if (!sessionCookie) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const { teams } = createSessionClient(sessionCookie);

        const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10');
        const page = parseInt(req.nextUrl.searchParams.get('page') || '1');

        const queries = [
            Query.limit(limit),
            Query.offset((page - 1) * limit),
        ];

        const memberships = await teams.listMemberships(params.teamId, queries);

        return NextResponse.json(memberships, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = (error as Error).message || 'Something went wrong';
        
        if (errorMessage.includes('Invalid session') || errorMessage.includes('Missing session')) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export const POST = async(req: NextRequest, { params }: { params: { teamId: string } }) => {
    try {
        const sessionCookie = req.cookies.get('session')?.value;
        
        if (!sessionCookie) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const { teams } = createSessionClient(sessionCookie);
        const { email, roles = [] } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const result = await teams.createMembership(params.teamId, roles, email);
        return NextResponse.json({ success: true, result }, { status: 201 });
    } catch (error: unknown) {
        const errorMessage = (error as Error).message || 'Something went wrong';
        
        if (errorMessage.includes('Invalid session') || errorMessage.includes('Missing session')) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}