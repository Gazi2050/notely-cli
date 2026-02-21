export interface ColumnConfig {
    head: string;
    index: number;
    width: number;
    threshold?: number;
}

export interface TableProps {
    data: string[][];
    columns: ColumnConfig[];
}
