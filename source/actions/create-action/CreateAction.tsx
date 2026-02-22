import React, { useState } from 'react';
import { Box, Text, useStdout } from 'ink';
import { TextInput, Alert, Spinner } from '@inkjs/ui';
import { CreateStep } from '../../types.js';
import { saveNote, LIMITS } from '../../utils.js';

export default function CreateAction() {
    const { stdout } = useStdout();
    const width = stdout?.columns || 80;
    const [step, setStep] = useState<CreateStep>('title');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [resetKey, setResetKey] = useState(0);
    const [descResetKey, setDescResetKey] = useState(0);

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
        <Box flexDirection="column" paddingBottom={1} width={width - 2}>
            <Box borderStyle="round" paddingX={1} marginBottom={1}>
                <Text bold>CREATE NOTE</Text>
            </Box>

            <Box flexDirection="column">
                {step === 'title' && (
                    <Box flexDirection="column">
                        <Box justifyContent="space-between">
                            <Text color="gray">Step 1: Title</Text>
                            <Text color={title.length >= LIMITS.TITLE ? 'red' : 'gray'}>
                                {title.length}/{LIMITS.TITLE}
                            </Text>
                        </Box>
                        <Box marginTop={1}>
                            <Text bold>❯ </Text>
                            <TextInput
                                key={resetKey}
                                placeholder="What is the title of your note?"
                                defaultValue={title}
                                onChange={(val) => {
                                    if (val.length <= LIMITS.TITLE) {
                                        setTitle(val);
                                    } else {
                                        setResetKey(prev => prev + 1);
                                    }
                                }}
                                onSubmit={() => {
                                    if (title.trim()) {
                                        setStep('content');
                                    }
                                }}
                            />
                        </Box>
                    </Box>
                )}

                {step === 'content' && (
                    <Box flexDirection="column">
                        <Box justifyContent="space-between">
                            <Text color="gray">Step 2: Description</Text>
                            <Text color={description.length >= LIMITS.DESCRIPTION ? 'red' : 'gray'}>
                                {description.length}/{LIMITS.DESCRIPTION}
                            </Text>
                        </Box>
                        <Box marginTop={1}>
                            <Text bold>❯ </Text>
                            <TextInput
                                key={descResetKey}
                                placeholder="Enter your note content here..."
                                defaultValue={description}
                                onChange={(val) => {
                                    if (val.length <= LIMITS.DESCRIPTION) {
                                        setDescription(val);
                                    } else {
                                        setDescResetKey(prev => prev + 1);
                                    }
                                }}
                                onSubmit={() => {
                                    handleSave();
                                }}
                            />
                        </Box>
                    </Box>
                )}

                {step === 'saving' && (
                    <Box marginTop={1}>
                        <Spinner label="Saving note to database..." />
                    </Box>
                )}

                {step === 'success' && (
                    <Alert variant="success">
                        Note "{title.length > 20 ? title.slice(0, 17) + '...' : title}" created successfully!
                    </Alert>
                )}

                {step === 'error' && (
                    <Alert variant="error">
                        {errorMessage}
                    </Alert>
                )}
            </Box>
        </Box>
    );
}
