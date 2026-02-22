import React, { useState } from 'react';
import { Box, Text, useStdout } from 'ink';
import { TextInput, Alert, Spinner } from '@inkjs/ui';
import { CreateStep } from '../types.js';
import { saveNote, LIMITS } from '../utils.js';

export default function CreateAction() {
    const { stdout } = useStdout();
    const width = stdout?.columns || 80;

    const [step, setStep] = useState<CreateStep>('title');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [resetKey, setResetKey] = useState(0);
    const [descResetKey, setDescResetKey] = useState(0);

    const stepNum = step === 'title' ? 1 : step === 'content' ? 2 : null;

    const handleSave = async () => {
        setStep('saving');
        try {
            await saveNote(title, description);
            setStep('success');
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to save note');
            setStep('error');
        }
    };

    return (
        <Box flexDirection="column" paddingY={1} width={width - 2}>
            <Box borderStyle="round" borderColor="green" paddingX={1} marginBottom={1}>
                <Text bold color="green">✦ NEW NOTE</Text>
                {stepNum && (
                    <Text color="gray" dimColor>  Step {stepNum}/2</Text>
                )}
            </Box>

            {step === 'title' && (
                <Box flexDirection="column">
                    <Box justifyContent="space-between">
                        <Text color="gray" dimColor>Enter a title for your note</Text>
                        <Text color={title.length >= LIMITS.TITLE ? 'red' : 'gray'} dimColor>
                            {title.length}/{LIMITS.TITLE}
                        </Text>
                    </Box>
                    <Box marginTop={1}>
                        <Text bold color="cyan">❯ </Text>
                        <TextInput
                            key={resetKey}
                            placeholder="My note title..."
                            defaultValue={title}
                            onChange={(val) => {
                                if (val.length <= LIMITS.TITLE) {
                                    setTitle(val);
                                } else {
                                    setResetKey(prev => prev + 1);
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
                        <Text color="gray" dimColor>Write your note content</Text>
                        <Text color={description.length >= LIMITS.DESCRIPTION ? 'red' : 'gray'} dimColor>
                            {description.length}/{LIMITS.DESCRIPTION}
                        </Text>
                    </Box>
                    <Box marginTop={1}>
                        <Text bold color="cyan">❯ </Text>
                        <TextInput
                            key={descResetKey}
                            placeholder="Start writing..."
                            defaultValue={description}
                            onChange={(val) => {
                                if (val.length <= LIMITS.DESCRIPTION) {
                                    setDescription(val);
                                } else {
                                    setDescResetKey(prev => prev + 1);
                                }
                            }}
                            onSubmit={() => { handleSave(); }}
                        />
                    </Box>
                </Box>
            )}

            {step === 'saving' && (
                <Box marginTop={1}>
                    <Spinner label="Saving note..." />
                </Box>
            )}

            {step === 'success' && (
                <Alert variant="success">
                    Note "{title.length > 30 ? title.slice(0, 27) + '...' : title}" saved!
                </Alert>
            )}

            {step === 'error' && (
                <Alert variant="error">{errorMessage}</Alert>
            )}
        </Box>
    );
}
