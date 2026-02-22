import { Low } from 'lowdb';
import { JSONFilePreset } from 'lowdb/node';
import { Data } from '../types.js';

const defaultData: Data = { notes: [] };

export const getDb = async (): Promise<Low<Data>> => {
    return await JSONFilePreset<Data>('db.json', defaultData);
};
