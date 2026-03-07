import {useMemo} from 'react';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Use standard FS to avoid import attribute issues in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const en = JSON.parse(fs.readFileSync(path.join(__dirname, '../locales/en.json'), 'utf-8'));
const am = JSON.parse(fs.readFileSync(path.join(__dirname, '../locales/am.json'), 'utf-8'));

export type Language = 'en' | 'am';

type TranslationSchema = typeof en;

const translations: Record<Language, TranslationSchema> = {
	en,
	am: am as unknown as TranslationSchema,
};

function getNestedValue(obj: any, path: string) {
	return path.split('.').reduce((prev, curr) => {
		return prev ? prev[curr] : undefined;
	}, obj);
}

export function useTranslation(lang: Language = 'en') {
	const t = useMemo(() => {
		return (key: string) => {
			const value = getNestedValue(translations[lang], key);
			return value || key;
		};
	}, [lang]);

	return {t};
}
