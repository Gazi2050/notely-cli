import Table3 from 'cli-table3';
import { ColumnConfig } from '../../types.js';

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

    // Calculate total requested width and number of borders
    const borderCount = activeCols.length + 1;
    const requestedWidth = colWidths.reduce((a, b) => a + b, 0);
    const totalMinimumWidth = borderCount + activeCols.length * 5; // Absolute minimum: borders + 5 chars per col

    // Effective width for columns after borders
    const colBudget = Math.max(totalMinimumWidth - borderCount, width - borderCount);

    if (requestedWidth > colBudget) {
        // Scale down proportionally
        const scale = colBudget / requestedWidth;
        for (let i = 0; i < colWidths.length; i++) {
            const currentWidth = colWidths[i] ?? 0;
            colWidths[i] = Math.max(5, Math.floor(currentWidth * scale));
        }

        // After potential scaling, ensure the last column fills remaining budget space
        const currentUsedColWidth = colWidths.reduce((a, b) => a + b, 0);
        if (colWidths.length > 0) {
            const lastIdx = colWidths.length - 1;
            const remaining = colBudget - currentUsedColWidth;
            if (remaining > 0) {
                const lastColWidth = colWidths[lastIdx] ?? 0;
                colWidths[lastIdx] = lastColWidth + remaining;
            }
        }
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
