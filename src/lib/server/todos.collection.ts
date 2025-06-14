import { Permission } from "node-appwrite";
import { db, todoCollection } from "../name";
import { databases } from "./appwrite";

export default async function createTodoCollection() {
    await databases.createCollection(db, todoCollection, todoCollection, [
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ])

    console.log(`Collection ${todoCollection} created`)

    await Promise.all([
        databases.createStringAttribute(db, todoCollection, "title", 200, true),
        databases.createStringAttribute(db, todoCollection, "description", 1000, false, ""),
        databases.createBooleanAttribute(db, todoCollection, "completed", false, false),
        databases.createStringAttribute(db, todoCollection, "userId", 200, true),
        databases.createDatetimeAttribute(db, todoCollection, "dueDate", false),
    ])
}