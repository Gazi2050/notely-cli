import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { TextInput, Alert, Spinner } from '@inkjs/ui';
import { deleteNoteById, deleteAllNotes, findNoteById } from '../../utils.js';
import { Note } from '../../types.js';

interface DeleteActionProps {
    id?: string;
}

type DeleteStep = 'confirm' | 'deleting' | 'success' | 'error' | 'id_input';

export default function DeleteAction({ id: initialId }: DeleteActionProps) {
    const [step, setStep] = useState<DeleteStep>(initialId ? 'confirm' : 'id_input');
    const [noteId, setNoteId] = useState(initialId || '');
    const [note, setNote] = useState<Note | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (noteId && noteId !== 'all' && step === 'confirm') {
            async function loadNote() {
                setLoading(true);
                const foundNote = await findNoteById(noteId);
                if (foundNote) {
                    setNote(foundNote);
                } else {
                    setErrorMessage(`Note with ID "${noteId}" not found.`);
                    setStep('error');
                }
                setLoading(false);
            }
            loadNote();
        }
    }, [noteId, step]);

    const handleDelete = async () => {
        setStep('deleting');
        try {
            if (noteId === 'all') {
                await deleteAllNotes();
                setStep('success');
            } else {
                const success = await deleteNoteById(noteId);
                if (success) {
                    setStep('success');
                } else {
                    setErrorMessage('Failed to delete note. It might have already been removed.');
                    setStep('error');
                }
            }
        } catch (error: any) {
            setErrorMessage(error.message || 'An error occurred during deletion.');
            setStep('error');
        }
    };

    if (loading) {
        return (
            <Box paddingY={1}>
                <Spinner label="Checking note ID..." />
            </Box>
        );
    }

    return (
        <Box flexDirection="column" paddingY={1}>
            <Box borderStyle="round" borderColor="red" paddingX={1} marginBottom={1}>
                <Text bold>DELETE NOTE</Text>
            </Box>

            {step === 'id_input' && (
                <Box flexDirection="column">
                    <Text color="gray">Enter the ID of the note you want to delete (or type 'all'):</Text>
                    <Box marginTop={1}>
                        <Text bold>ID ❯ </Text>
                        <TextInput
                            placeholder="e.g. fc4c754d4 or all"
                            onSubmit={(val) => {
                                if (val.trim()) {
                                    setNoteId(val.trim());
                                    setStep('confirm');
                                }
                            }}
                        />
                    </Box>
                </Box>
            )}

            {step === 'confirm' && (note || noteId === 'all') && (
                <Box flexDirection="column">
                    <Alert variant="warning">
                        {noteId === 'all'
                            ? 'Are you sure you want to delete ALL notes? This cannot be undone.'
                            : 'Are you sure you want to delete this note?'}
                    </Alert>
                    {noteId === 'all' && (
                        <Box borderStyle="single" borderColor="red" paddingX={1} marginY={1}>
                            <Text bold color="red">WARNING: EVERYTHING WILL BE DELETED</Text>
                        </Box>
                    )}
                    {note && (
                        <Box borderStyle="single" borderColor="gray" paddingX={1} marginY={1} flexDirection="column">
                            <Text bold>{note.title}</Text>
                            <Text color="gray" dimColor>{note.content.slice(0, 50)}{note.content.length > 50 ? '...' : ''}</Text>
                        </Box>
                    )}
                    <Box>
                        <Text>{noteId === 'all' ? 'Confirm DELETE ALL? (type "yes") ❯ ' : 'Confirm deletion? (y/N) ❯ '}</Text>
                        <TextInput
                            onSubmit={(val) => {
                                const confirmed = noteId === 'all'
                                    ? val.toLowerCase() === 'yes'
                                    : (val.toLowerCase() === 'y' || val.toLowerCase() === 'yes');

                                if (confirmed) {
                                    handleDelete();
                                } else {
                                    setErrorMessage('Deletion cancelled.');
                                    setStep('error');
                                }
                            }}
                        />
                    </Box>
                </Box>
            )}

            {step === 'deleting' && (
                <Spinner label="Removing note from database..." />
            )}

            {step === 'success' && (
                <Alert variant="success">
                    Note deleted successfully!
                </Alert>
            )}

            {step === 'error' && (
                <Box flexDirection="column">
                    <Alert variant="error">
                        {errorMessage}
                    </Alert>
                    <Box marginTop={1}>
                        <Text color="gray">Press <Text bold>Enter</Text> to try again or exit.</Text>
                        <TextInput
                            onSubmit={() => {
                                setStep('id_input');
                                setErrorMessage('');
                                setNote(null);
                            }}
                        />
                    </Box>
                </Box>
            )}
        </Box>
    );
}
