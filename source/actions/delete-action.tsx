import React, {useState, useEffect} from 'react';
import {Box, Text} from 'ink';
import {TextInput, Alert, Spinner} from '@inkjs/ui';
import {deleteNoteById, deleteAllNotes, findNoteById} from '../utils.js';
import {type Note} from '../types.js';

type DeleteActionProps = {
	readonly id?: string;
};

type DeleteStep = 'id_input' | 'confirm' | 'deleting' | 'success' | 'error';

export default function DeleteAction({id: initialId}: DeleteActionProps) {
	const [step, setStep] = useState<DeleteStep>(
		initialId ? 'confirm' : 'id_input',
	);
	const [noteId, setNoteId] = useState(initialId ?? '');
	const [note, setNote] = useState<Note | undefined>();
	const [errorMessage, setErrorMessage] = useState('');
	const [loading, setLoading] = useState(false);

	const isDeleteAll = noteId === 'all';

	useEffect(() => {
		const loadNote = async () => {
			setLoading(true);
			const foundNote = await findNoteById(noteId);
			if (foundNote) {
				setNote(foundNote);
			} else {
				setErrorMessage(`Note with ID "${noteId}" not found.`);
				setStep('error');
			}

			setLoading(false);
		};

		if (noteId && !isDeleteAll && step === 'confirm') {
			void loadNote();
		}
	}, [noteId, isDeleteAll, step]);

	const handleDelete = async () => {
		setStep('deleting');
		try {
			if (isDeleteAll) {
				await deleteAllNotes();
				setStep('success');
			} else {
				const success = await deleteNoteById(noteId);
				if (success) {
					setStep('success');
				} else {
					setErrorMessage(
						'Failed to delete note. It may have already been removed.',
					);
					setStep('error');
				}
			}
		} catch (error: unknown) {
			setErrorMessage(
				(error as Error).message ?? 'An error occurred during deletion.',
			);
			setStep('error');
		}
	};

	if (loading) {
		return (
			<Box paddingY={1}>
				<Spinner label="Looking up note..." />
			</Box>
		);
	}

	return (
		<Box flexDirection="column" paddingY={1}>
			<Box borderStyle="round" borderColor="red" paddingX={1} marginBottom={1}>
				<Text bold color="red">
					✦ DELETE NOTE
				</Text>
			</Box>

			{step === 'id_input' && (
				<Box flexDirection="column">
					<Text dimColor color="gray">
						Enter a note ID, or type{' '}
					</Text>
					<Text bold dimColor>
						&quot;all&quot;
					</Text>
					<Text dimColor color="gray">
						{' '}
						to delete everything
					</Text>
					<Box marginTop={1}>
						<Text bold color="cyan">
							❯{' '}
						</Text>
						<TextInput
							placeholder="Note ID or 'all'..."
							onSubmit={value => {
								if (value.trim()) {
									setNoteId(value.trim());
									setStep('confirm');
								}
							}}
						/>
					</Box>
				</Box>
			)}

			{step === 'confirm' && (note ?? isDeleteAll) && (
				<Box flexDirection="column">
					{isDeleteAll ? (
						<>
							<Alert variant="warning">
								This will permanently delete ALL notes. This cannot be undone.
							</Alert>
							<Box
								borderStyle="single"
								borderColor="red"
								paddingX={2}
								paddingY={0}
								marginY={1}
							>
								<Text bold color="red">
									⚠ EVERYTHING WILL BE DELETED
								</Text>
							</Box>
							<Box marginTop={1}>
								<Text bold color="cyan">
									❯{' '}
								</Text>
								<Text dimColor>Type </Text>
								<Text bold>&quot;yes&quot;</Text>
								<Text dimColor> to confirm: </Text>
								<TextInput
									onSubmit={value => {
										if (value.toLowerCase() === 'yes') {
											void handleDelete();
										} else {
											setErrorMessage('Deletion cancelled.');
											setStep('error');
										}
									}}
								/>
							</Box>
						</>
					) : (
						<>
							<Alert variant="warning">
								Are you sure you want to delete this note?
							</Alert>
							{note && (
								<Box
									borderStyle="single"
									borderColor="gray"
									paddingX={2}
									marginY={1}
									flexDirection="column"
								>
									<Text bold>{note.title}</Text>
									<Text dimColor color="gray">
										{note.content.slice(0, 60)}
										{note.content.length > 60 ? '…' : ''}
									</Text>
								</Box>
							)}
							<Box marginTop={1}>
								<Text bold color="cyan">
									❯{' '}
								</Text>
								<Text dimColor>Confirm? (y/n): </Text>
								<TextInput
									onSubmit={value => {
										if (
											value.toLowerCase() === 'y' ||
											value.toLowerCase() === 'yes'
										) {
											void handleDelete();
										} else {
											setErrorMessage('Deletion cancelled.');
											setStep('error');
										}
									}}
								/>
							</Box>
						</>
					)}
				</Box>
			)}

			{step === 'deleting' && <Spinner label="Deleting..." />}

			{step === 'success' && (
				<Alert variant="success">
					{isDeleteAll ? 'All notes deleted.' : 'Note deleted successfully!'}
				</Alert>
			)}

			{step === 'error' && (
				<Box flexDirection="column">
					<Alert variant="error">{errorMessage}</Alert>
					<Box marginTop={1}>
						<Text dimColor>Press </Text>
						<Text bold dimColor>
							Enter
						</Text>
						<Text dimColor> to try again</Text>
						<TextInput
							onSubmit={() => {
								setStep('id_input');
								setErrorMessage('');
								setNote(undefined);
							}}
						/>
					</Box>
				</Box>
			)}
		</Box>
	);
}
