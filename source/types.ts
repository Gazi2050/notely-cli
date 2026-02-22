export type Note = {
	id: string;
	title: string;
	content: string;
	createdAt: string;
	updatedAt: string;
};

export type CreateStep = 'title' | 'content' | 'saving' | 'success' | 'error';

export type UpdateStep =
	| 'id'
	| 'title'
	| 'description'
	| 'saving'
	| 'success'
	| 'error';

export type ColumnConfig = {
	head: string;
	index: number;
	width: number;
	threshold?: number;
};

export type TableProps = {
	data: string[][];
	columns: ColumnConfig[];
};

export type Data = {
	notes: Note[];
};
