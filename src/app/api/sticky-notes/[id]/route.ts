import { db, stickyNotesCollection } from "@/lib/name";
import { databases } from "@/lib/server/appwrite";
import { NextResponse } from "next/server"

export const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const id = (await params).id

        const deletedNote = await databases.deleteDocument(db, stickyNotesCollection, id);

        if(!deletedNote) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Note deleted successfully" }, { status: 200 });
    } catch  {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}