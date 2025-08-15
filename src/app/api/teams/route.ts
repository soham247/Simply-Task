import { createSessionClient } from "@/lib/server/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { Query, ID } from "node-appwrite";

export const GET = async(req: NextRequest) => {
    try {
        const sessionCookie = req.cookies.get('session')?.value;
        
        if (!sessionCookie) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const { teams } = createSessionClient(sessionCookie);

        const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10');
        const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
        const query = req.nextUrl.searchParams.get('query') || '';

        const queries = [
            Query.limit(limit),
            Query.offset((page - 1) * limit),
        ];

        if (query) {
            queries.push(Query.search('name', query));
        }

        const userTeams = await teams.list(queries);

        return NextResponse.json(userTeams, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = (error as Error).message || 'Something went wrong';
        
        if (errorMessage.includes('Invalid session') || errorMessage.includes('Missing session')) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export const POST = async(req: NextRequest) => {
    try {
        const sessionCookie = req.cookies.get('session')?.value;
        
        if (!sessionCookie) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const { teams } = createSessionClient(sessionCookie);
        const { teamName } = await req.json();

        if (!teamName) {
            return NextResponse.json({ error: 'Team name is required' }, { status: 400 });
        }

        const team = await teams.create(ID.unique(), teamName);
        return NextResponse.json({ success: true, team }, { status: 201 });
    } catch (error: unknown) {
        const errorMessage = (error as Error).message || 'Something went wrong';
        
        if (errorMessage.includes('Invalid session') || errorMessage.includes('Missing session')) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}