import React, {useState, useEffect} from 'react';
import {Box, Text, useStdout} from 'ink';
import {Spinner} from '@inkjs/ui';
import fs from 'node:fs/promises';
import {DB_PATH, getDb} from '../db/db.js';
import {useTranslation, type Language} from '../hooks/use-translation.js';

type PathActionProps = {
	readonly lang: Language;
};

export default function PathAction({lang}: PathActionProps) {
	const {stdout} = useStdout();
	const width = stdout?.columns || 80;
	const {t} = useTranslation(lang);

	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState<{
		size: string;
		count: number;
		lastModified: string;
	} | null>(null);

	useEffect(() => {
		async function getStats() {
			try {
				const db = await getDb();
				const count = db.data.notes.length;

				const fileInfo = await fs.stat(DB_PATH);
				const sizeInBytes = fileInfo.size;
				const size =
					sizeInBytes < 1024
						? `${sizeInBytes} B`
						: `${(sizeInBytes / 1024).toFixed(2)} KB`;

				const lastModified = fileInfo.mtime.toLocaleDateString() + ' ' + fileInfo.mtime.toLocaleTimeString();

				setStats({count, size, lastModified});
			} catch {
				// If DB doesn't exist yet, it's 0 notes/0 bytes
				setStats({count: 0, size: '0 B', lastModified: 'Never'});
			} finally {
				setLoading(false);
			}
		}

		void getStats();
	}, []);

	if (loading) {
		return (
			<Box paddingY={1}>
				<Spinner label={t('actions.path.loading') || 'Gathering database stats...'} />
			</Box>
		);
	}

	return (
		<Box flexDirection="column" paddingY={1} width={width - 2}>
			<Box
				borderStyle="round"
				borderColor="cyan"
				paddingX={1}
				marginBottom={1}
			>
				<Text bold color="cyan">
					✦ {t('actions.path.header')}
				</Text>
			</Box>

			<Box paddingX={1} flexDirection="column">
				<Box marginBottom={1}>
					<Text color="gray">{t('actions.path.location')}</Text>
					<Box marginLeft={1}>
						<Text bold color="white">
							{DB_PATH}
						</Text>
					</Box>
				</Box>

				<Box flexDirection="column" borderStyle="single" borderColor="gray" paddingX={1} width={40}>
					<Box justifyContent="space-between">
						<Text color="gray">{t('actions.path.total_notes')}</Text>
						<Text bold color="green">{stats?.count}</Text>
					</Box>
					<Box justifyContent="space-between">
						<Text color="gray">{t('actions.path.file_size')}</Text>
						<Text bold color="yellow">{stats?.size}</Text>
					</Box>
					<Box justifyContent="space-between">
						<Text color="gray">{t('actions.path.last_updated')}</Text>
						<Text bold color="blue">{stats?.lastModified}</Text>
					</Box>
				</Box>

				<Box marginTop={1}>
					<Text dimColor color="gray">
						{t('actions.path.pro_tip')}
					</Text>
				</Box>
			</Box>
		</Box>
	);
}
