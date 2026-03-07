import React, {useMemo, useState, useEffect} from 'react';
import {Box, Text} from 'ink';
import {Alert, Spinner} from '@inkjs/ui';
import Table from '../components/table/table.js';
import {fetchNotes, formatNoteDate, findNoteById} from '../utils.js';
import {type Note} from '../types.js';
import {useTranslation, type Language} from '../hooks/use-translation.js';

type ReadActionProps = {
	readonly id?: string;
	readonly lang: Language;
};

export default function ReadAction({id, lang}: ReadActionProps) {
	const {t} = useTranslation(lang);
	const [notes, setNotes] = useState<Note[]>([]);
	const [selectedNote, setSelectedNote] = useState<Note | undefined>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | undefined>();

	useEffect(() => {
		async function load() {
			try {
				if (id) {
					const note = await findNoteById(id);
					if (note) {
						setSelectedNote(note);
					} else {
						setError(`Note with ID "${id}" not found.`);
					}
				} else {
					const fetchedNotes = await fetchNotes();
					setNotes(fetchedNotes);
				}
			} catch (error_: unknown) {
				setError((error_ as Error).message ?? 'Failed to load data');
			} finally {
				setLoading(false);
			}
		}

		void load();
	}, [id]);

	const columns = useMemo(
		() => [
			{head: t('actions.read.id'), index: 0, width: 15},
			{head: t('actions.read.title'), index: 1, width: 55},
			{head: t('actions.read.created_at'), index: 2, width: 26},
		],
		[t],
	);

	const rows = useMemo(() => {
		return notes.map(note => [
			note.id,
			note.title,
			formatNoteDate(note.createdAt),
		]);
	}, [notes]);

	if (loading) {
		return (
			<Box paddingY={1}>
				<Spinner label={t('actions.read.loading')} />
			</Box>
		);
	}

	if (error) {
		return (
			<Box paddingY={1}>
				<Alert variant="error">{error}</Alert>
			</Box>
		);
	}

	if (id && selectedNote) {
		return (
			<Box flexDirection="column" paddingY={1}>
				<Box
					borderStyle="round"
					borderColor="cyan"
					paddingX={1}
					marginBottom={1}
				>
					<Text bold color="cyan">
						✦ {t('actions.read.detail_header')}
					</Text>
				</Box>

				<Box
					borderStyle="single"
					borderColor="gray"
					paddingX={2}
					paddingY={1}
					flexDirection="column"
				>
					<Box marginBottom={1}>
						<Text bold color="white">
							{selectedNote.title}
						</Text>
					</Box>

					<Text dimColor color="gray">
						{'─'.repeat(40)}
					</Text>

					<Box marginTop={1} marginBottom={1}>
						<Text>{selectedNote.content}</Text>
					</Box>

					<Text dimColor color="gray">
						{'─'.repeat(40)}
					</Text>

					<Box marginTop={1} flexDirection="column">
						<Text dimColor color="gray">
							{t('actions.read.id')} {selectedNote.id}
						</Text>
						<Text dimColor color="gray">
							{t('actions.read.created_at')} {formatNoteDate(selectedNote.createdAt)}
						</Text>
						{selectedNote.updatedAt && (
							<Text dimColor color="gray">
								Updated {formatNoteDate(selectedNote.updatedAt)}
							</Text>
						)}
					</Box>
				</Box>
			</Box>
		);
	}

	if (notes.length === 0) {
		return (
			<Box flexDirection="column" paddingY={1}>
				<Box
					borderStyle="round"
					borderColor="cyan"
					paddingX={1}
					marginBottom={1}
				>
					<Text bold color="cyan">
						✦ {t('actions.read.header')}
					</Text>
				</Box>
				<Box paddingX={1}>
					<Text color="gray">{t('actions.read.no_notes')} </Text>
					<Text bold color="green">
						notely-cli -c
					</Text>
				</Box>
			</Box>
		);
	}

	return (
		<Box flexDirection="column" paddingY={1}>
			<Box borderStyle="round" borderColor="cyan" paddingX={1} marginBottom={1}>
				<Text bold color="cyan">
					✦ {t('actions.read.header')}
				</Text>
				<Text dimColor color="gray">
					{' '}
					{notes.length} note{notes.length === 1 ? '' : 's'}
				</Text>
			</Box>

			<Table columns={columns} data={rows} />

			<Box marginTop={1}>
				<Text dimColor>Run </Text>
				<Text bold dimColor>
					notely-cli -r {'<id>'}
				</Text>
			</Box>
		</Box>
	);
}
