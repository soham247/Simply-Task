import { db, stickyNotesCollection } from "@/lib/name";
import { databases } from "@/lib/server/appwrite";
import { getCurrentUser } from "@/lib/server/auth";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

export const GET = async () => {
  try {
    const { user } = await getCurrentUser();    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const notes = await databases.listDocuments(db, stickyNotesCollection, [
      Query.equal("userId", user.$id),
    ]);
    
    return NextResponse.json({ stickyNotes: notes.documents }, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const { content, color } = await request.json();

    if (!content || !color) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { user } = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Add await here - this was missing!
    const note = await databases.createDocument(
      db,
      stickyNotesCollection,
      ID.unique(),
      {
        content: content,
        userId: user.$id,
        color: color,
      }
    );
    
    console.log("Created note:", note);
    return NextResponse.json({ stickyNote: note }, { status: 200 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};