"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@workspace/ui/components/table";

interface DataTableProps {
	data: {
		headers: string[];
		rows: (string | number)[][];
		title?: string;
	};
}

export function DataTable({ data }: DataTableProps) {
	return (
		<div className="w-full overflow-x-auto">
			{data.title && (
				<h3 className="text-lg font-semibold mb-4" id="table-title">
					{data.title}
				</h3>
			)}
			<Table
				aria-labelledby={data.title ? "table-title" : undefined}
				role="table"
			>
				<TableHeader>
					<TableRow>
						{data.headers.map((header, index) => (
							<TableHead
								key={index}
								scope="col"
								aria-label={`Column ${index + 1}: ${header}`}
							>
								{header}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.rows.map((row, rowIndex) => (
						<TableRow key={rowIndex} aria-label={`Row ${rowIndex + 1}`}>
							{row.map((cell, cellIndex) => (
								<TableCell
									key={cellIndex}
									aria-label={`${data.headers[cellIndex]}: ${cell}`}
								>
									{cell}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
