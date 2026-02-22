import React, {useMemo} from 'react';
import {Box, Text, useStdout} from 'ink';
import BigText from 'ink-big-text';
import Table from './components/table/table.js';
import CreateAction from './actions/create-action.js';
import ReadAction from './actions/read-action.js';
import UpdateAction from './actions/update-action.js';
import DeleteAction from './actions/delete-action.js';

type AppProps = {
	readonly flags: {
		create?: boolean;
		update?: boolean;
		delete?: boolean;
		read?: boolean;
	};
	readonly input: string[];
};

export default function App({flags, input}: AppProps) {
	const {stdout} = useStdout();
	const width = stdout?.columns || 80;

	const columns = useMemo(
		() => [
			{head: 'Flag', index: 0, width: 14},
			{head: 'Shorthand', index: 1, width: 12},
			{head: 'Description', index: 2, width: 30},
		],
		[],
	);

	const helpData = [
		['--create', '-c', 'Create a new note'],
		['--read', '-r', 'List / read notes'],
		['--update', '-u', 'Update a note'],
		['--delete', '-d', 'Delete a note'],
	];

	if (flags.create) return <CreateAction />;
	if (flags.read) return <ReadAction id={input[0]} />;
	if (flags.update) return <UpdateAction />;
	if (flags.delete) return <DeleteAction id={input[0]} />;

	return (
		<Box flexDirection="column" paddingY={1}>
			{width > 80 ? (
				<BigText text="Note CLI" />
			) : (
				<Box paddingY={1}>
					<Text bold color="cyan">
						{' '}
						✦ NOTE CLI ✦{' '}
					</Text>
				</Box>
			)}

			<Box marginBottom={1}>
				<Text color="cyan">
					Your minimal note-taking tool for the terminal.
				</Text>
			</Box>

			<Box marginBottom={1}>
				<Text dimColor color="cyan">
					{'─'.repeat(46)}
				</Text>
			</Box>

			<Box>
				<Table data={helpData} columns={columns} />
			</Box>
		</Box>
	);
}
