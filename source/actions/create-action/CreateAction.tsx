import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { TextInput, Alert, Spinner } from '@inkjs/ui';
import { CreateStep } from './types.js';
import { saveNote } from './utils.js';

export default function CreateAction() {
    const [step, setStep] = useState<CreateStep>('title');
    const [title, setTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSave = async (finalContent: string) => {
        setStep('saving');
        try {
            await saveNote(title, finalContent);
            setStep('success');
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to save note');
            setStep('error');
        }
    };

    return (
        <Box flexDirection="column" paddingBottom={1}>
            {step === 'title' && (
                <Box flexDirection="column">
                    <Text bold color="cyan">Create New Note</Text>
                    <Box marginTop={1}>
                        <Text>Enter Title: </Text>
                        <TextInput
                            placeholder="e.g. My study note"
                            onSubmit={(val) => {
                                setTitle(val);
                                setStep('content');
                            }}
                        />
                    </Box>
                </Box>
            )}

            {step === 'content' && (
                <Box flexDirection="column">
                    <Text bold color="cyan">Create New Note: {title}</Text>
                    <Box marginTop={1}>
                        <Text>Enter Description: </Text>
                        <TextInput
                            placeholder="What's this note about?"
                            onSubmit={(val) => {
                                handleSave(val);
                            }}
                        />
                    </Box>
                </Box>
            )}

            {step === 'saving' && (
                <Spinner label="Saving note to database..." />
            )}

            {step === 'success' && (
                <Alert variant="success">
                    Note "{title}" created successfully!
                </Alert>
            )}

            {step === 'error' && (
                <Alert variant="error">
                    {errorMessage}
                </Alert>
            )}
        </Box>
    );
}
