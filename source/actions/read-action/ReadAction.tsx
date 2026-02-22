import React, { useMemo, useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { Alert } from '@inkjs/ui';
import Table from '../../components/table/Table.js';
import { fetchNotes, formatNoteDate, findNoteById } from '../../utils.js';
import { Note } from '../../types.js';

interface ReadActionProps {
    id?: string;
}

export default function ReadAction({ id }: ReadActionProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            } catch (err: any) {
                setError(err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    const columns = useMemo(() => [
        { head: 'ID', index: 0, width: 15 },
        { head: 'Title', index: 1, width: 55 },
        { head: 'Created At', index: 2, width: 26 }
    ], []);

    const rows = useMemo(() => {
        return notes.map(note => [
            note.id,
            note.title,
            formatNoteDate(note.createdAt)
        ]);
    }, [notes]);

    if (loading) {
        return (
            <Box paddingY={1}>
                <Text color="yellow">Loading...</Text>
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
                <Box borderStyle="round" borderColor="cyan" paddingX={1} flexDirection="column">
                    <Box marginBottom={1}>
                        <Text bold color="yellow">NOTE DETAILS</Text>
                    </Box>
                    <Box flexDirection="column" gap={0}>
                        <Box>
                            <Text bold>ID: </Text>
                            <Text>{selectedNote.id}</Text>
                        </Box>
                        <Box>
                            <Text bold>Title: </Text>
                            <Text>{selectedNote.title}</Text>
                        </Box>
                        <Box marginTop={1} marginBottom={1} flexDirection="column">
                            <Text bold underline>Content:</Text>
                            <Text>{selectedNote.content}</Text>
                        </Box>
                        <Box borderStyle="single" borderTop={true} borderBottom={false} borderLeft={false} borderRight={false} paddingTop={1}>
                            <Text color="gray">Created: {formatNoteDate(selectedNote.createdAt)}</Text>
                            {selectedNote.updatedAt && (
                                <Text color="gray"> | Updated: {formatNoteDate(selectedNote.updatedAt)}</Text>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }

    if (notes.length === 0) {
        return (
            <Box paddingY={1}>
                <Text color="red">No notes found. Create one with `note-cli -c`!</Text>
            </Box>
        );
    }

    return (
        <Box flexDirection="column" paddingY={1}>
            <Box borderStyle="round" borderColor="green" paddingX={1} marginBottom={1}>
                <Text bold>LIST OF NOTES</Text>
            </Box>
            <Table columns={columns} data={rows} />
            <Box marginTop={1}>
                <Text color="gray">Showing {notes.length} note(s)</Text>
            </Box>
        </Box>
    );
}
