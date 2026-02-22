import crypto from 'node:crypto';
import dayjs from 'dayjs';
import {getDb} from './db/db.js';
import {type Note} from './types.js';

export const limits = {
	title: 50,
	description: 300,
};

export const saveNote = async (title: string, content: string) => {
	const db = await getDb();

	const newNote = {
		id: crypto.randomBytes(5).toString('hex').slice(0, 9),
		title,
		content,
		createdAt: new Date().toISOString(),
		updatedAt: '',
	};

	db.data.notes.push(newNote);
	await db.write();

	return newNote;
};

export const fetchNotes = async (): Promise<Note[]> => {
	const db = await getDb();
	return db.data.notes;
};

export const formatNoteDate = (date: string): string => {
	return dayjs(date).format('MMM D, YYYY h:mm A');
};

export const findNoteById = async (id: string): Promise<Note | undefined> => {
	const db = await getDb();
	return db.data.notes.find(note => note.id === id);
};

export const updateNote = async (
	id: string,
	updates: Partial<Note>,
): Promise<void> => {
	const db = await getDb();
	const index = db.data.notes.findIndex(note => note.id === id);

	if (index !== -1) {
		db.data.notes[index] = {
			...db.data.notes[index]!,
			...updates,
			updatedAt: new Date().toISOString(),
		};
		await db.write();
	}
};

export const deleteNoteById = async (id: string): Promise<boolean> => {
	const db = await getDb();
	const initialLength = db.data.notes.length;
	db.data.notes = db.data.notes.filter(note => note.id !== id);

	if (db.data.notes.length < initialLength) {
		await db.write();
		return true;
	}

	return false;
};

export const deleteAllNotes = async (): Promise<void> => {
	const db = await getDb();
	db.data.notes = [];
	await db.write();
};
