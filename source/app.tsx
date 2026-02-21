import React, { useMemo } from 'react';
import { Box, Text } from 'ink';
import BigText from 'ink-big-text';
import Table from './components/table/Table.js';

export default function App() {
	const columns = useMemo(() => [
		{ head: 'Command', index: 0, width: 12 },
		{ head: 'Description', index: 1, width: 30 },
	], []);

	const data = [
		['-c', 'Create a new note'],
		['-r', 'Read/List notes'],
		['-u', 'Update an existing note'],
		['-d', 'Delete a note'],
	];

	return (
		<Box flexDirection="column">
			<BigText text="Note CLI" />
			<Text>Welcome to Note CLI ✍️</Text>
			<Box marginTop={1}>
				<Table data={data} columns={columns} />
			</Box>
		</Box>
	);
}
