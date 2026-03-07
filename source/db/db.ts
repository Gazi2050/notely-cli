import path from 'node:path';
import process from 'node:process';
import {type Low} from 'lowdb';
// eslint-disable-next-line n/file-extension-in-import
import {JSONFilePreset} from 'lowdb/node';
import {type Data} from '../types.js';

const defaultData: Data = {notes: []};

export const DB_PATH = path.resolve(process.cwd(), 'db.json');

export const getDb = async (): Promise<Low<Data>> => {
	// eslint-disable-next-line new-cap
	return JSONFilePreset<Data>(DB_PATH, defaultData);
};
