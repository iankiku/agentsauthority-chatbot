"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

interface LineChartProps {
	data: {
		name: string;
		[key: string]: string | number;
	}[];
	lines: {
		dataKey: string;
		stroke: string;
	}[];
	title?: string;
}

export function LineChartComponent({ data, lines, title }: LineChartProps) {
	return (
		<div
			className="w-full h-[300px]"
			role="img"
			aria-label={title || "Line chart showing data trends"}
		>
			{title && (
				<h3 className="text-lg font-semibold mb-4" id="chart-title">
					{title}
				</h3>
			)}
			<LineChart
				data={data}
				margin={{
					left: 12,
					right: 12,
					top: 12,
					bottom: 12,
				}}
				aria-labelledby={title ? "chart-title" : undefined}
			>
				<CartesianGrid strokeDasharray="3 3" vertical={false} />
				<XAxis
					dataKey="name"
					tickLine={false}
					axisLine={false}
					tickMargin={8}
				/>
				<YAxis tickLine={false} axisLine={false} tickMargin={8} />
				{lines.map((line) => (
					<Line
						key={line.dataKey}
						type="monotone"
						dataKey={line.dataKey}
						stroke={line.stroke}
						strokeWidth={2}
						dot={false}
					/>
				))}
			</LineChart>
			{/* Screen reader accessible data summary */}
			<div className="sr-only" aria-live="polite">
				{title && `${title}. `}
				Chart showing {lines.length} data series over {data.length} data points.
				{data.map((point, index) => (
					<span key={index}>
						{point.name}:{" "}
						{lines
							.map((line) => `${line.dataKey}: ${point[line.dataKey]}`)
							.join(", ")}
						.
					</span>
				))}
			</div>
		</div>
	);
}
