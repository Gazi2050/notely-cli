import React, {useState} from 'react';
import {Box, Text, useStdout} from 'ink';
import {TextInput, Alert, Spinner} from '@inkjs/ui';
import {type UpdateStep} from '../types.js';
import {findNoteById, updateNote, limits} from '../utils.js';
import {useTranslation, type Language} from '../hooks/use-translation.js';

type UpdateActionProps = {
	readonly lang: Language;
};

export default function UpdateAction({lang}: UpdateActionProps) {
	const {stdout} = useStdout();
	const width = stdout?.columns || 80;
	const {t} = useTranslation(lang);

	const [step, setStep] = useState<UpdateStep>('id');
	const [noteId, setNoteId] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [resetKey, setResetKey] = useState(0);
	const [descResetKey, setDescResetKey] = useState(0);

	const stepNumber =
		step === 'id'
			? 1
			: step === 'title'
			? 2
			: step === 'description'
			? 3
			: null;

	const handleFindNote = async (id: string) => {
		const note = await findNoteById(id);
		if (note) {
			setTitle(note.title);
			setDescription(note.content);
			setStep('title');
		} else {
			setErrorMessage(`Note with ID "${id}" not found.`);
			setStep('error');
		}
	};

	const handleUpdate = async () => {
		setStep('saving');
		try {
			await updateNote(noteId, {title, content: description});
			setStep('success');
		} catch (error: unknown) {
			setErrorMessage((error as Error).message ?? 'Failed to update note');
			setStep('error');
		}
	};

	return (
		<Box flexDirection="column" paddingY={1} width={width - 2}>
			<Box
				borderStyle="round"
				borderColor="yellow"
				paddingX={1}
				marginBottom={1}
			>
				<Text bold color="yellow">
					✦ {t('actions.update.header')}
				</Text>
				{stepNumber && (
					<Text dimColor color="gray">
						{' '}
						{t('actions.create.step')} {stepNumber}/3
					</Text>
				)}
			</Box>

			{step === 'id' && (
				<Box flexDirection="column">
					<Text dimColor color="gray">
						{t('actions.update.id_label')}
					</Text>
					<Box marginTop={1}>
						<Text bold color="cyan">
							❯{' '}
						</Text>
						<TextInput
							placeholder="Note ID..."
							onSubmit={value => {
								if (value.trim()) {
									setNoteId(value.trim());
									void handleFindNote(value.trim());
								}
							}}
						/>
					</Box>
				</Box>
			)}

			{step === 'title' && (
				<Box flexDirection="column">
					<Box justifyContent="space-between">
						<Text dimColor color="gray">
							{t('actions.update.title_label')}
						</Text>
						<Text
							dimColor
							color={title.length >= limits.title ? 'red' : 'gray'}
						>
							{title.length}/{limits.title}
						</Text>
					</Box>
					<Box marginTop={1}>
						<Text bold color="cyan">
							❯{' '}
						</Text>
						<TextInput
							key={resetKey}
							defaultValue={title}
							onChange={value => {
								if (value.length <= limits.title) {
									setTitle(value);
								} else {
									setResetKey(previous => previous + 1);
								}
							}}
							onSubmit={() => {
								if (title.trim()) setStep('description');
							}}
						/>
					</Box>
				</Box>
			)}

			{step === 'description' && (
				<Box flexDirection="column">
					<Box justifyContent="space-between">
						<Text dimColor color="gray">
							{t('actions.update.content_label')}
						</Text>
						<Text
							dimColor
							color={description.length >= limits.description ? 'red' : 'gray'}
						>
							{description.length}/{limits.description}
						</Text>
					</Box>
					<Box marginTop={1}>
						<Text bold color="cyan">
							❯{' '}
						</Text>
						<TextInput
							key={descResetKey}
							defaultValue={description}
							onChange={value => {
								if (value.length <= limits.description) {
									setDescription(value);
								} else {
									setDescResetKey(previous => previous + 1);
								}
							}}
							onSubmit={() => {
								void handleUpdate();
							}}
						/>
					</Box>
				</Box>
			)}

			{step === 'saving' && (
				<Box marginTop={1}>
					<Spinner label={t('actions.update.saving')} />
				</Box>
			)}

			{step === 'success' && (
				<Alert variant="success">{t('actions.update.success')}</Alert>
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
								setStep('id');
								setErrorMessage('');
							}}
						/>
					</Box>
				</Box>
			)}
		</Box>
	);
}
