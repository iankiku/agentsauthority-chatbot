"use client";

import { cn } from "@workspace/utils";

interface DashboardGridProps {
	children: React.ReactNode;
	className?: string;
	columns?: {
		default: number;
		sm?: number;
		md?: number;
		lg?: number;
		xl?: number;
	};
	gap?: number;
}

export function DashboardGrid({
	children,
	className,
	columns = { default: 1, md: 2, lg: 3 },
	gap = 6,
}: DashboardGridProps) {
	const getGridClasses = () => {
		const classes = ["grid"];
		
		// Default columns
		classes.push(`grid-cols-${columns.default}`);
		
		// Responsive columns
		if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
		if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
		if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
		if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
		
		// Gap
		classes.push(`gap-${gap}`);
		
		return classes.join(" ");
	};

	return (
		<div className={cn(getGridClasses(), className)}>
			{children}
		</div>
	);
}

interface DashboardSectionProps {
	title?: string;
	description?: string;
	children: React.ReactNode;
	className?: string;
	headerActions?: React.ReactNode;
}

export function DashboardSection({
	title,
	description,
	children,
	className,
	headerActions,
}: DashboardSectionProps) {
	return (
		<div className={cn("space-y-6", className)}>
			{(title || description || headerActions) && (
				<div className="flex items-center justify-between">
					<div>
						{title && (
							<h2 className="text-2xl font-bold tracking-tight text-foreground">
								{title}
							</h2>
						)}
						{description && (
							<p className="text-muted-foreground mt-1">
								{description}
							</p>
						)}
					</div>
					{headerActions && (
						<div className="flex items-center gap-2">
							{headerActions}
						</div>
					)}
				</div>
			)}
			{children}
		</div>
	);
}

interface DashboardCardProps {
	children: React.ReactNode;
	className?: string;
	span?: {
		default?: number;
		sm?: number;
		md?: number;
		lg?: number;
		xl?: number;
	};
}

export function DashboardCard({
	children,
	className,
	span,
}: DashboardCardProps) {
	const getSpanClasses = () => {
		if (!span) return "";
		
		const classes = [];
		
		if (span.default) classes.push(`col-span-${span.default}`);
		if (span.sm) classes.push(`sm:col-span-${span.sm}`);
		if (span.md) classes.push(`md:col-span-${span.md}`);
		if (span.lg) classes.push(`lg:col-span-${span.lg}`);
		if (span.xl) classes.push(`xl:col-span-${span.xl}`);
		
		return classes.join(" ");
	};

	return (
		<div className={cn(getSpanClasses(), className)}>
			{children}
		</div>
	);
}
