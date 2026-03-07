import React, {useMemo, useState, useEffect} from 'react';
import {Box, Text, useStdout} from 'ink';
import BigText from 'ink-big-text';
import {Spinner} from '@inkjs/ui';
import Table from './components/table/table.js';
import CreateAction from './actions/create-action.js';
import ReadAction from './actions/read-action.js';
import UpdateAction from './actions/update-action.js';
import DeleteAction from './actions/delete-action.js';
import PathAction from './actions/path-action.js';
import {useTranslation, type Language} from './hooks/use-translation.js';
import {getAppConfig, updateLanguage} from './db/config.js';

type AppProps = {
	readonly flags: {
		create?: boolean;
		update?: boolean;
		delete?: boolean;
		read?: boolean;
		path?: boolean;
		lang?: string;
	};
	readonly input: string[];
};

export default function App({flags, input}: AppProps) {
	const {stdout} = useStdout();
	const width = stdout?.columns || 80;

	const [lang, setLang] = useState<Language | null>(null);
	const {t} = useTranslation(lang || 'en');

	useEffect(() => {
		async function initConfig() {
			const config = await getAppConfig();
			let currentLang = config.data.language;

			// Priority: Flag > Config
			if (flags.lang === 'am' || flags.lang === 'en') {
				currentLang = flags.lang as Language;
				if (currentLang !== config.data.language) {
					await updateLanguage(currentLang);
				}
			}

			setLang(currentLang);
		}

		void initConfig();
	}, [flags.lang]);

	const columns = useMemo(
		() => [
			{head: t('common.help_table.flag'), index: 0, width: 14},
			{head: t('common.help_table.shorthand'), index: 1, width: 12},
			{head: t('common.help_table.description'), index: 2, width: 30},
		],
		[t],
	);

	const helpData = useMemo(
		() => [
			['--create', '-c', t('actions.create.label')],
			['--read', '-r', t('actions.read.label')],
			['--update', '-u', t('actions.update.label')],
			['--delete', '-d', t('actions.delete.label')],
			['--path', '-p', t('actions.path.label')],
		],
		[t],
	);

	if (!lang) {
		return (
			<Box paddingY={1}>
				<Spinner label="Loading settings..." />
			</Box>
		);
	}

	if (flags.create) return <CreateAction lang={lang} />;
	if (flags.read) return <ReadAction id={input[0]} lang={lang} />;
	if (flags.update) return <UpdateAction lang={lang} />;
	if (flags.delete) return <DeleteAction id={input[0]} lang={lang} />;
	if (flags.path) return <PathAction lang={lang} />;

	return (
		<Box flexDirection="column" paddingY={1}>
			{width > 80 ? (
				<BigText text={t('common.app_title')} />
			) : (
				<Box paddingY={1}>
					<Text bold color="cyan">
						{' '}
						✦ {t('common.app_title')} ✦{' '}
					</Text>
				</Box>
			)}

			<Box marginBottom={1}>
				<Text color="cyan">{t('common.app_subtitle')}</Text>
			</Box>

			<Box marginBottom={1}>
				<Text dimColor color="cyan">
					{'─'.repeat(46)}
				</Text>
			</Box>

			<Box>
				<Table data={helpData} columns={columns} />
			</Box>
		</Box>
	);
}
