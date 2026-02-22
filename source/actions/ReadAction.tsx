import React, { useMemo, useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { Alert, Spinner } from '@inkjs/ui';
import Table from '../components/table/Table.js';
import { fetchNotes, formatNoteDate, findNoteById } from '../utils.js';
import { Note } from '../types.js';

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
                <Spinner label="Loading notes..." />
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
                <Box borderStyle="round" borderColor="cyan" paddingX={1} marginBottom={1}>
                    <Text bold color="cyan">✦ NOTE DETAIL</Text>
                </Box>

                <Box borderStyle="single" borderColor="gray" paddingX={2} paddingY={1} flexDirection="column">
                    <Box marginBottom={1}>
                        <Text bold color="white">{selectedNote.title}</Text>
                    </Box>

                    <Text color="gray" dimColor>{'─'.repeat(40)}</Text>

                    <Box marginTop={1} marginBottom={1}>
                        <Text>{selectedNote.content}</Text>
                    </Box>

                    <Text color="gray" dimColor>{'─'.repeat(40)}</Text>

                    <Box marginTop={1} flexDirection="column">
                        <Text color="gray" dimColor>ID      {selectedNote.id}</Text>
                        <Text color="gray" dimColor>Created {formatNoteDate(selectedNote.createdAt)}</Text>
                        {selectedNote.updatedAt && (
                            <Text color="gray" dimColor>Updated {formatNoteDate(selectedNote.updatedAt)}</Text>
                        )}
                    </Box>
                </Box>
            </Box>
        );
    }

    if (notes.length === 0) {
        return (
            <Box flexDirection="column" paddingY={1}>
                <Box borderStyle="round" borderColor="cyan" paddingX={1} marginBottom={1}>
                    <Text bold color="cyan">✦ NOTES</Text>
                </Box>
                <Box paddingX={1}>
                    <Text color="gray">No notes yet. </Text>
                    <Text bold color="green">note-cli -c</Text>
                    <Text color="gray"> to create one.</Text>
                </Box>
            </Box>
        );
    }

    return (
        <Box flexDirection="column" paddingY={1}>
            <Box borderStyle="round" borderColor="cyan" paddingX={1} marginBottom={1}>
                <Text bold color="cyan">✦ NOTES</Text>
                <Text color="gray" dimColor>  {notes.length} note{notes.length !== 1 ? 's' : ''}</Text>
            </Box>

            <Table columns={columns} data={rows} />

            <Box marginTop={1}>
                <Text dimColor>Run </Text>
                <Text bold dimColor>note-cli -r {'<id>'}</Text>
                <Text dimColor> to view details</Text>
            </Box>
        </Box>
    );
}
