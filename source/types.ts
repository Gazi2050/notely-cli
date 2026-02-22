export interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export type CreateStep = 'title' | 'content' | 'saving' | 'success' | 'error';

export type UpdateStep = 'id' | 'title' | 'description' | 'saving' | 'success' | 'error';

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

export interface Data {
    notes: Note[];
}
