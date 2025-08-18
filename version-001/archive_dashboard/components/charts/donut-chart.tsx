"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@workspace/ui/components/chart";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface DonutChartProps {
	data: Array<{
		name: string;
		value: number;
		color: string;
	}>;
	title?: string;
	height?: number;
	showTooltip?: boolean;
	centerText?: {
		value: string | number;
		label: string;
	};
}

export function DonutChart({
	data,
	title,
	height = 300,
	showTooltip = true,
	centerText,
}: DonutChartProps) {
	const chartConfig = data.reduce((acc, item) => {
		acc[item.name] = {
			label: item.name,
			color: item.color,
		};
		return acc;
	}, {} as any);

	return (
		<div className="w-full">
			{title && (
				<h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
			)}
			<ChartContainer config={chartConfig} className={`h-[${height}px] w-full`}>
				<PieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						innerRadius={60}
						outerRadius={100}
						paddingAngle={2}
						dataKey="value"
					>
						{data.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Pie>
					{showTooltip && (
						<ChartTooltip
							content={<ChartTooltipContent />}
						/>
					)}
					{centerText && (
						<text
							x="50%"
							y="50%"
							textAnchor="middle"
							dominantBaseline="middle"
							className="fill-foreground"
						>
							<tspan x="50%" dy="-0.5em" className="text-2xl font-bold">
								{centerText.value}
							</tspan>
							<tspan x="50%" dy="1.5em" className="text-sm text-muted-foreground">
								{centerText.label}
							</tspan>
						</text>
					)}
				</PieChart>
			</ChartContainer>
		</div>
	);
}
