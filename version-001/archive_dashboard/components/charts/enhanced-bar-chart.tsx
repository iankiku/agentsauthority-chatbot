"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@workspace/ui/components/chart";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface EnhancedBarChartProps {
	data: Array<{
		name: string;
		[key: string]: string | number;
	}>;
	bars: Array<{
		dataKey: string;
		fill: string;
		name: string;
	}>;
	title?: string;
	height?: number;
	showGrid?: boolean;
	showTooltip?: boolean;
	layout?: "horizontal" | "vertical";
}

export function EnhancedBarChart({
	data,
	bars,
	title,
	height = 300,
	showGrid = true,
	showTooltip = true,
	layout = "vertical",
}: EnhancedBarChartProps) {
	const chartConfig = bars.reduce((acc, bar) => {
		acc[bar.dataKey] = {
			label: bar.name,
			color: bar.fill,
		};
		return acc;
	}, {} as any);

	return (
		<div className="w-full">
			{title && (
				<h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
			)}
			<ChartContainer config={chartConfig} className={`h-[${height}px] w-full`}>
				<BarChart
					data={data}
					layout={layout}
					margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
				>
					{showGrid && <CartesianGrid strokeDasharray="3 3" />}
					<XAxis
						type={layout === "vertical" ? "category" : "number"}
						dataKey={layout === "vertical" ? "name" : undefined}
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						fontSize={12}
					/>
					<YAxis
						type={layout === "vertical" ? "number" : "category"}
						dataKey={layout === "horizontal" ? "name" : undefined}
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						fontSize={12}
					/>
					{showTooltip && (
						<ChartTooltip
							cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
							content={<ChartTooltipContent />}
						/>
					)}
					{bars.map((bar) => (
						<Bar
							key={bar.dataKey}
							dataKey={bar.dataKey}
							fill={`var(--color-${bar.dataKey})`}
							radius={4}
						/>
					))}
				</BarChart>
			</ChartContainer>
		</div>
	);
}
