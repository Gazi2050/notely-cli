import React, {useState} from 'react';
import {Box, Text, useStdout} from 'ink';
import {TextInput, Alert, Spinner} from '@inkjs/ui';
import {type CreateStep} from '../types.js';
import {saveNote, limits} from '../utils.js';
import {useTranslation, type Language} from '../hooks/use-translation.js';

type CreateActionProps = {
	readonly lang: Language;
};

export default function CreateAction({lang}: CreateActionProps) {
	const {stdout} = useStdout();
	const width = stdout?.columns || 80;
	const {t} = useTranslation(lang);

	const [step, setStep] = useState<CreateStep>('title');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [resetKey, setResetKey] = useState(0);
	const [descResetKey, setDescResetKey] = useState(0);

	const stepNumber = step === 'title' ? 1 : step === 'content' ? 2 : null;

	const handleSave = async () => {
		setStep('saving');
		try {
			await saveNote(title, description);
			setStep('success');
		} catch (error: unknown) {
			setErrorMessage((error as Error).message ?? 'Failed to save note');
			setStep('error');
		}
	};

	return (
		<Box flexDirection="column" paddingY={1} width={width - 2}>
			<Box
				borderStyle="round"
				borderColor="green"
				paddingX={1}
				marginBottom={1}
			>
				<Text bold color="green">
					✦ {t('actions.create.header')}
				</Text>
				{stepNumber && (
					<Text dimColor color="gray">
						{' '}
						{t('actions.create.step')} {stepNumber}/2
					</Text>
				)}
			</Box>

			{step === 'title' && (
				<Box flexDirection="column">
					<Box justifyContent="space-between">
						<Text dimColor color="gray">
							{t('actions.create.title_label')}
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
							placeholder={t('actions.create.title_placeholder')}
							defaultValue={title}
							onChange={value => {
								if (value.length <= limits.title) {
									setTitle(value);
								} else {
									setResetKey(previous => previous + 1);
								}
							}}
							onSubmit={() => {
								if (title.trim()) setStep('content');
							}}
						/>
					</Box>
				</Box>
			)}

			{step === 'content' && (
				<Box flexDirection="column">
					<Box justifyContent="space-between">
						<Text dimColor color="gray">
							{t('actions.create.content_label')}
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
							placeholder={t('actions.create.content_placeholder')}
							defaultValue={description}
							onChange={value => {
								if (value.length <= limits.description) {
									setDescription(value);
								} else {
									setDescResetKey(previous => previous + 1);
								}
							}}
							onSubmit={() => {
								void handleSave();
							}}
						/>
					</Box>
				</Box>
			)}

			{step === 'saving' && (
				<Box marginTop={1}>
					<Spinner label={t('actions.create.saving')} />
				</Box>
			)}

			{step === 'success' && (
				<Alert variant="success">
					{t('actions.create.success')} &quot;{title.length > 30 ? title.slice(0, 27) + '...' : title}
					&quot;!
				</Alert>
			)}

			{step === 'error' && <Alert variant="error">{errorMessage}</Alert>}
		</Box>
	);
}
