"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@workspace/ui/components/chart";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface EnhancedLineChartProps {
	data: Array<{
		name: string;
		[key: string]: string | number;
	}>;
	lines: Array<{
		dataKey: string;
		stroke: string;
		name: string;
	}>;
	title?: string;
	height?: number;
	showGrid?: boolean;
	showTooltip?: boolean;
}

export function EnhancedLineChart({
	data,
	lines,
	title,
	height = 300,
	showGrid = true,
	showTooltip = true,
}: EnhancedLineChartProps) {
	const chartConfig = lines.reduce((acc, line) => {
		acc[line.dataKey] = {
			label: line.name,
			color: line.stroke,
		};
		return acc;
	}, {} as any);

	return (
		<div className="w-full">
			{title && (
				<h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
			)}
			<ChartContainer config={chartConfig} className={`h-[${height}px] w-full`}>
				<LineChart data={data} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
					{showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
					<XAxis
						dataKey="name"
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						fontSize={12}
					/>
					<YAxis
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						fontSize={12}
					/>
					{showTooltip && (
						<ChartTooltip
							cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1 }}
							content={<ChartTooltipContent />}
						/>
					)}
					{lines.map((line) => (
						<Line
							key={line.dataKey}
							type="monotone"
							dataKey={line.dataKey}
							stroke={`var(--color-${line.dataKey})`}
							strokeWidth={2}
							dot={{ r: 4, strokeWidth: 2 }}
							activeDot={{ r: 6, strokeWidth: 0 }}
						/>
					))}
				</LineChart>
			</ChartContainer>
		</div>
	);
}
