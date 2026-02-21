import React from 'react';
import { Box, Text } from 'ink';

export default function App() {
	const banner = `
 _   _       _        ____ _     ___ 
| \\ | | ___ | |_ ___ / ___| |   |_ _|
|  \\| |/ _ \\| __/ _ \\ |   | |    | | 
| |\\  | (_) | ||  __/ |___| |___ | | 
|_| \\_|\\___/ \\__\\___|\\____|_____|___|
`;

	return (
		<Box flexDirection="column">
			<Text color="cyan">{banner}</Text>
			<Text>Welcome to Note CLI ✍️</Text>
		</Box>
	);
}
