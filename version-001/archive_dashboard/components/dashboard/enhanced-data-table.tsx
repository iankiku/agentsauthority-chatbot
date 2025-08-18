"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@workspace/ui/components/table";
import { cn } from "@workspace/utils";
import {
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	Download,
	Filter,
	Search,
} from "lucide-react";
import { useState } from "react";

interface Column {
	key: string;
	label: string;
	sortable?: boolean;
	render?: (value: any, row: any) => React.ReactNode;
	className?: string;
}

interface EnhancedDataTableProps {
	title?: string;
	data: any[];
	columns: Column[];
	searchable?: boolean;
	filterable?: boolean;
	exportable?: boolean;
	pagination?: boolean;
	pageSize?: number;
	className?: string;
}

export function EnhancedDataTable({
	title,
	data,
	columns,
	searchable = true,
	filterable = false,
	exportable = true,
	pagination = true,
	pageSize = 10,
	className,
}: EnhancedDataTableProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [sortColumn, setSortColumn] = useState<string | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const [currentPage, setCurrentPage] = useState(1);

	// Filter data based on search term
	const filteredData = data.filter((row) =>
		searchTerm === ""
			? true
			: Object.values(row).some((value) =>
					String(value).toLowerCase().includes(searchTerm.toLowerCase())
			  )
	);

	// Sort data
	const sortedData = [...filteredData].sort((a, b) => {
		if (!sortColumn) return 0;

		const aValue = a[sortColumn];
		const bValue = b[sortColumn];

		if (typeof aValue === "number" && typeof bValue === "number") {
			return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
		}

		const aString = String(aValue).toLowerCase();
		const bString = String(bValue).toLowerCase();

		if (sortDirection === "asc") {
			return aString.localeCompare(bString);
		} else {
			return bString.localeCompare(aString);
		}
	});

	// Paginate data
	const totalPages = Math.ceil(sortedData.length / pageSize);
	const startIndex = (currentPage - 1) * pageSize;
	const paginatedData = pagination
		? sortedData.slice(startIndex, startIndex + pageSize)
		: sortedData;

	const handleSort = (columnKey: string) => {
		if (sortColumn === columnKey) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortColumn(columnKey);
			setSortDirection("asc");
		}
	};

	const handleExport = () => {
		// Simple CSV export
		const headers = columns.map((col) => col.label).join(",");
		const rows = sortedData
			.map((row) =>
				columns
					.map((col) => {
						const value = row[col.key];
						return typeof value === "string" && value.includes(",")
							? `"${value}"`
							: value;
					})
					.join(",")
			)
			.join("\n");

		const csv = `${headers}\n${rows}`;
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${title || "data"}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<Card className={className}>
			{(title || searchable || filterable || exportable) && (
				<CardHeader className="pb-4">
					<div className="flex items-center justify-between">
						{title && <CardTitle className="text-xl font-semibold">{title}</CardTitle>}
						<div className="flex items-center gap-2">
							{searchable && (
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
									<Input
										placeholder="Search..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-10 w-64"
									/>
								</div>
							)}
							{filterable && (
								<Button variant="outline" size="sm">
									<Filter className="w-4 h-4 mr-2" />
									Filter
								</Button>
							)}
							{exportable && (
								<Button variant="outline" size="sm" onClick={handleExport}>
									<Download className="w-4 h-4 mr-2" />
									Export
								</Button>
							)}
						</div>
					</div>
				</CardHeader>
			)}
			<CardContent>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								{columns.map((column) => (
									<TableHead
										key={column.key}
										className={cn(
											column.sortable && "cursor-pointer hover:bg-muted/50",
											column.className
										)}
										onClick={() => column.sortable && handleSort(column.key)}
									>
										<div className="flex items-center gap-2">
											{column.label}
											{column.sortable && (
												<ArrowUpDown className="w-4 h-4 text-muted-foreground" />
											)}
											{sortColumn === column.key && (
												<span className="text-xs text-muted-foreground">
													{sortDirection === "asc" ? "↑" : "↓"}
												</span>
											)}
										</div>
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{paginatedData.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="text-center py-8 text-muted-foreground"
									>
										No data found
									</TableCell>
								</TableRow>
							) : (
								paginatedData.map((row, index) => (
									<TableRow key={index} className="hover:bg-muted/50">
										{columns.map((column) => (
											<TableCell key={column.key} className={column.className}>
												{column.render
													? column.render(row[column.key], row)
													: row[column.key]}
											</TableCell>
										))}
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>

				{pagination && totalPages > 1 && (
					<div className="flex items-center justify-between mt-4">
						<div className="text-sm text-muted-foreground">
							Showing {startIndex + 1} to {Math.min(startIndex + pageSize, sortedData.length)} of{" "}
							{sortedData.length} results
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setCurrentPage(currentPage - 1)}
								disabled={currentPage === 1}
							>
								<ChevronLeft className="w-4 h-4" />
								Previous
							</Button>
							<div className="flex items-center gap-1">
								{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
									const page = i + 1;
									return (
										<Button
											key={page}
											variant={currentPage === page ? "default" : "outline"}
											size="sm"
											onClick={() => setCurrentPage(page)}
											className="w-8 h-8 p-0"
										>
											{page}
										</Button>
									);
								})}
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setCurrentPage(currentPage + 1)}
								disabled={currentPage === totalPages}
							>
								Next
								<ChevronRight className="w-4 h-4" />
							</Button>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
