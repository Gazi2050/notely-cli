import React, { useState } from 'react';
import { Box, Text, useStdout } from 'ink';
import { TextInput, Alert, Spinner } from '@inkjs/ui';
import { UpdateStep } from '../types.js';
import { findNoteById, updateNote, LIMITS } from '../utils.js';

export default function UpdateAction() {
    const { stdout } = useStdout();
    const width = stdout?.columns || 80;

    const [step, setStep] = useState<UpdateStep>('id');
    const [noteId, setNoteId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [resetKey, setResetKey] = useState(0);
    const [descResetKey, setDescResetKey] = useState(0);

    const stepNum = step === 'id' ? 1 : step === 'title' ? 2 : step === 'description' ? 3 : null;

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
            await updateNote(noteId, { title, content: description });
            setStep('success');
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to update note');
            setStep('error');
        }
    };

    return (
        <Box flexDirection="column" paddingY={1} width={width - 2}>
            <Box borderStyle="round" borderColor="yellow" paddingX={1} marginBottom={1}>
                <Text bold color="yellow">✦ UPDATE NOTE</Text>
                {stepNum && (
                    <Text color="gray" dimColor>  Step {stepNum}/3</Text>
                )}
            </Box>

            {step === 'id' && (
                <Box flexDirection="column">
                    <Text color="gray" dimColor>Enter the ID of the note to update</Text>
                    <Box marginTop={1}>
                        <Text bold color="cyan">❯ </Text>
                        <TextInput
                            placeholder="Note ID..."
                            onSubmit={(val) => {
                                if (val.trim()) {
                                    setNoteId(val.trim());
                                    handleFindNote(val.trim());
                                }
                            }}
                        />
                    </Box>
                </Box>
            )}

            {step === 'title' && (
                <Box flexDirection="column">
                    <Box justifyContent="space-between">
                        <Text color="gray" dimColor>Update title  (press Enter to keep current)</Text>
                        <Text color={title.length >= LIMITS.TITLE ? 'red' : 'gray'} dimColor>
                            {title.length}/{LIMITS.TITLE}
                        </Text>
                    </Box>
                    <Box marginTop={1}>
                        <Text bold color="cyan">❯ </Text>
                        <TextInput
                            key={resetKey}
                            defaultValue={title}
                            onChange={(val) => {
                                if (val.length <= LIMITS.TITLE) {
                                    setTitle(val);
                                } else {
                                    setResetKey(prev => prev + 1);
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
                        <Text color="gray" dimColor>Update content  (press Enter to keep current)</Text>
                        <Text color={description.length >= LIMITS.DESCRIPTION ? 'red' : 'gray'} dimColor>
                            {description.length}/{LIMITS.DESCRIPTION}
                        </Text>
                    </Box>
                    <Box marginTop={1}>
                        <Text bold color="cyan">❯ </Text>
                        <TextInput
                            key={descResetKey}
                            defaultValue={description}
                            onChange={(val) => {
                                if (val.length <= LIMITS.DESCRIPTION) {
                                    setDescription(val);
                                } else {
                                    setDescResetKey(prev => prev + 1);
                                }
                            }}
                            onSubmit={() => { handleUpdate(); }}
                        />
                    </Box>
                </Box>
            )}

            {step === 'saving' && (
                <Box marginTop={1}>
                    <Spinner label="Updating note..." />
                </Box>
            )}

            {step === 'success' && (
                <Alert variant="success">Note updated successfully!</Alert>
            )}

            {step === 'error' && (
                <Box flexDirection="column">
                    <Alert variant="error">{errorMessage}</Alert>
                    <Box marginTop={1}>
                        <Text dimColor>Press </Text>
                        <Text bold dimColor>Enter</Text>
                        <Text dimColor> to try again</Text>
                        <TextInput onSubmit={() => { setStep('id'); setErrorMessage(''); }} />
                    </Box>
                </Box>
            )}
        </Box>
    );
}
