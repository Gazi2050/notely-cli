import crypto from 'node:crypto';
import { getDb } from '../../db/db.js';

export const saveNote = async (title: string, content: string) => {
    const db = await getDb();

    const newNote = {
        id: crypto.randomUUID(),
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: '',
    };

    db.data.notes.push(newNote);
    await db.write();

    return newNote;
};
