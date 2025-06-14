import { NextRequest, NextResponse } from "next/server";
import getOrCreateDB from "./lib/server/dbSetup";

export async function middleware( request: NextRequest ) {
    await Promise.all([
        getOrCreateDB()
    ])
    return NextResponse.next()
}

export const config = {
    matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
}