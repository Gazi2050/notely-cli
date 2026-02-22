import React, { useMemo } from 'react';
import { Box, Text, useStdout } from 'ink';
import BigText from 'ink-big-text';
import Table from './components/table/Table.js';
import CreateAction from './actions/CreateAction.js';
import ReadAction from './actions/ReadAction.js';
import UpdateAction from './actions/UpdateAction.js';
import DeleteAction from './actions/DeleteAction.js';

interface AppProps {
	flags: {
		create?: boolean;
		update?: boolean;
		delete?: boolean;
		read?: boolean;
	};
	input: string[];
}

export default function App({ flags, input }: AppProps) {
	const { stdout } = useStdout();
	const width = stdout?.columns || 80;

	const columns = useMemo(() => [
		{ head: 'Flag', index: 0, width: 10 },
		{ head: 'Description', index: 1, width: 30 },
	], []);

	const helpData = [
		['-c', 'Create a new note'],
		['-r', 'List / read notes'],
		['-u', 'Update a note'],
		['-d', 'Delete a note'],
	];

	if (flags.create) return <CreateAction />;
	if (flags.read) return <ReadAction id={input[0]} />;
	if (flags.update) return <UpdateAction />;
	if (flags.delete) return <DeleteAction id={input[0]} />;

	return (
		<Box flexDirection="column" paddingY={1}>
			{/* Logo */}
			{width > 80 ? (
				<BigText text="Note CLI" />
			) : (
				<Box paddingY={1}>
					<Text bold color="cyan">  ✦ NOTE CLI ✦  </Text>
				</Box>
			)}

			{/* Tagline */}
			<Box marginBottom={1}>
				<Text color="gray">Your minimal note-taking tool for the terminal.</Text>
			</Box>

			{/* Divider */}
			<Box marginBottom={1}>
				<Text color="cyan" dimColor>{'─'.repeat(46)}</Text>
			</Box>

			{/* Help table */}
			<Box>
				<Table data={helpData} columns={columns} />
			</Box>
		</Box>
	);
}
