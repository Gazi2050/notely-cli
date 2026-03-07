import path from 'node:path';
import process from 'node:process';
import {type Low} from 'lowdb';
// eslint-disable-next-line n/file-extension-in-import
import {JSONFilePreset} from 'lowdb/node';
import {type Config} from '../types.js';

const defaultConfig: Config = {
	language: 'en',
};

export const CONFIG_PATH = path.resolve(process.cwd(), 'config.json');

export const getAppConfig = async (): Promise<Low<Config>> => {
	// eslint-disable-next-line new-cap
	return JSONFilePreset<Config>(CONFIG_PATH, defaultConfig);
};

export const updateLanguage = async (language: 'en' | 'am') => {
	const db = await getAppConfig();
	db.data.language = language;
	await db.write();
};
