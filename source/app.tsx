import React, { useMemo } from 'react';
import { Box, Text, useStdout } from 'ink';
import BigText from 'ink-big-text';
import Table from './components/table/Table.js';
import CreateAction from './actions/create-action/CreateAction.js';

interface AppProps {
	flags: {
		create?: boolean;
		update?: boolean;
		delete?: boolean;
		read?: boolean;
	};
}

export default function App({ flags }: AppProps) {
	const { stdout } = useStdout();
	const width = stdout?.columns || 80;

	const columns = useMemo(() => [
		{ head: 'Command', index: 0, width: 12 },
		{ head: 'Description', index: 1, width: 30 },
	], []);

	const helpData = [
		['-c', 'Create a new note'],
		['-r', 'Read/List notes'],
		['-u', 'Update an existing note'],
		['-d', 'Delete a note'],
	];

	if (flags.create) {
		return <CreateAction />;
	}

	return (
		<Box flexDirection="column" paddingBottom={1}>
			{width > 80 ? (
				<BigText text="Note CLI" />
			) : (
				<Box paddingY={1}>
					<Text bold backgroundColor="black">
						{" "}NOTE CLI{" "}
					</Text>
				</Box>
			)}
			<Text>Welcome to Note CLI ✍️</Text>
			<Box marginTop={1}>
				<Table data={helpData} columns={columns} />
			</Box>
		</Box>
	);
}
