import {type Low} from 'lowdb';
// eslint-disable-next-line n/file-extension-in-import
import {JSONFilePreset} from 'lowdb/node';
import {type Data} from '../types.js';

const defaultData: Data = {notes: []};

export const getDb = async (): Promise<Low<Data>> => {
	// eslint-disable-next-line new-cap
	return JSONFilePreset<Data>('db.json', defaultData);
};
