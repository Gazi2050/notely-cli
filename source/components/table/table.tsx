import React, {useMemo} from 'react';
import {Text, useStdout} from 'ink';
import {type TableProps} from '../../types.js';
import {generateTableString} from './utils.js';

export default function Table({data, columns}: TableProps) {
	const {stdout} = useStdout();
	const width = stdout?.columns || 80;

	const tableString = useMemo(() => {
		const safeWidth = Math.max(40, width - 2);
		return generateTableString(safeWidth, data, columns);
	}, [width, data, columns]);

	return <Text>{tableString}</Text>;
}
