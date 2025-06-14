import { db } from "../name";
import { databases } from "./appwrite";
import createStickyNotesCollection from "./stickyNotes.collection";
import createTodoCollection from "./todos.collection";

export default async function getOrCreateDB() {
    try {
        await databases.get(db);
        console.log('====================================');
        console.log('DB connected');
        console.log('====================================');
    } catch (error) {
        try {
            await databases.create(db, db);
            console.log('====================================');
            console.log('DB created');
            console.log('====================================');
            await Promise.all([
                createTodoCollection(),
                createStickyNotesCollection()
            ])
            console.log('====================================');
            console.log('Collections created');
            console.log('====================================');
        } catch (error) {
            console.log('====================================');
            console.log('DB creation failed');
            console.log('====================================');
            
        }
    }
    return databases
}