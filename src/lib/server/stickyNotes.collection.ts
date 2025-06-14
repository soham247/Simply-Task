import { Permission } from "node-appwrite";
import { db, stickyNotesCollection } from "../name";
import { databases } from "./appwrite";

export default async function createStickyNotesCollection() {
    await databases.createCollection(db, stickyNotesCollection, stickyNotesCollection, [
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users")
    ])

    console.log('====================================');
    console.log('Sticky Notes Collection Created');
    console.log('====================================');

    await Promise.all([
        databases.createStringAttribute(db, stickyNotesCollection, "content", 1000, true),
        databases.createStringAttribute(db, stickyNotesCollection, "userId", 200, true),
        databases.createStringAttribute(db, stickyNotesCollection, "color", 200, false, "#E64C14"),
    ])
}