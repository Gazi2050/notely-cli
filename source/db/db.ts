import { Low } from 'lowdb';
import { JSONFilePreset } from 'lowdb/node';
import { Data } from './types.js';

const defaultData: Data = { notes: [] };

// Initialize the database
// This will create db.json if it doesn't exist
export const getDb = async (): Promise<Low<Data>> => {
    return await JSONFilePreset<Data>('db.json', defaultData);
};
