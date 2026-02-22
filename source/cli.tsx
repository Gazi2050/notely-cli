#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
	`
	Usage
	  $ note-cli

	Options
		--create, -c  Create a new note
		--update, -u  Update an existing note
		--delete, -d  Delete a note
		--read,   -r  Read/List notes

	Examples
	  $ note-cli --create
	  $ note-cli -c
	`,
	{
		importMeta: import.meta,
		flags: {
			create: {
				type: 'boolean',
				alias: 'c',
			},
			update: {
				type: 'boolean',
				alias: 'u',
			},
			delete: {
				type: 'boolean',
				alias: 'd',
			},
			read: {
				type: 'boolean',
				alias: 'r',
			},
		},
	},
);

render(<App flags={cli.flags} input={cli.input} />);
