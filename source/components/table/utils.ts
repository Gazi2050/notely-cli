import Table3 from 'cli-table3';
import { ColumnConfig } from './types.js';

export const generateTableString = (
    width: number,
    data: string[][],
    columns: ColumnConfig[]
): string => {
    const activeCols: ColumnConfig[] = [];
    const colWidths: number[] = [];
    const dataIndexes: number[] = [];

    // Determine which columns to show based on threshold
    columns.forEach(col => {
        if (!col.threshold || width > col.threshold) {
            activeCols.push(col);
            colWidths.push(col.width);
            dataIndexes.push(col.index);
        }
    });

    const availableWidth = width - 6;
    const usedWidth = colWidths.reduce((a, b) => a + b, 0) + colWidths.length + 1;

    // The last column always takes the remaining space
    if (colWidths.length > 0) {
        const lastIdx = colWidths.length - 1;
        const lastWidth = colWidths[lastIdx] || 0;
        colWidths[lastIdx] = Math.max(15, availableWidth - (usedWidth - lastWidth));
    }

    const t = new Table3({
        head: activeCols.map(c => c.head),
        colWidths,
        wordWrap: true,
        chars: {
            'top': '─', 'top-mid': '┬', 'top-left': '╭', 'top-right': '╮',
            'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '╰', 'bottom-right': '╯',
            'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
            'right': '│', 'right-mid': '┤', 'middle': '│'
        }
    });

    data.forEach(row => {
        const activeRow = dataIndexes.map(i => row[i] || '');
        t.push(activeRow);
    });

    return t.toString();
};
