"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { cn } from "@workspace/utils";
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

interface EnhancedMetricCardProps {
	title: string;
	value: string | number;
	change?: {
		value: number;
		period: string;
		type: "increase" | "decrease" | "neutral";
	};
	icon: LucideIcon;
	iconColor?: string;
	iconBgColor?: string;
	subtitle?: string;
	progress?: {
		value: number;
		max?: number;
		color?: string;
	};
	badge?: {
		text: string;
		variant?: "default" | "secondary" | "destructive" | "outline";
	};
	actions?: Array<{
		label: string;
		onClick: () => void;
		variant?: "default" | "outline" | "secondary";
	}>;
	className?: string;
}

export function EnhancedMetricCard({
	title,
	value,
	change,
	icon: Icon,
	iconColor = "text-white",
	iconBgColor = "bg-brand-600",
	subtitle,
	progress,
	badge,
	actions,
	className,
}: EnhancedMetricCardProps) {
	const getTrendIcon = () => {
		if (!change) return null;
		return change.type === "increase" ? TrendingUp : TrendingDown;
	};

	const getTrendColor = () => {
		if (!change) return "";
		switch (change.type) {
			case "increase":
				return "text-green-600";
			case "decrease":
				return "text-red-600";
			default:
				return "text-muted-foreground";
		}
	};

	const TrendIcon = getTrendIcon();

	return (
		<Card className={cn("relative overflow-hidden", className)}>
			<CardContent className="p-6">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-2">
							<p className="text-sm text-muted-foreground font-medium">{title}</p>
							{badge && (
								<Badge variant={badge.variant || "default"} className="text-xs">
									{badge.text}
								</Badge>
							)}
						</div>
						
						<div className="flex items-baseline gap-2 mb-2">
							<p className="text-3xl font-bold text-foreground">{value}</p>
							{change && TrendIcon && (
								<div className={cn("flex items-center text-sm", getTrendColor())}>
									<TrendIcon className="w-3 h-3 mr-1" />
									{change.value > 0 ? "+" : ""}{change.value} {change.period}
								</div>
							)}
						</div>

						{subtitle && (
							<p className="text-sm text-muted-foreground mb-3">{subtitle}</p>
						)}

						{progress && (
							<div className="mb-4">
								<div className="flex justify-between text-xs text-muted-foreground mb-2">
									<span>Progress</span>
									<span>{progress.value}{progress.max ? `/${progress.max}` : "%"}</span>
								</div>
								<Progress 
									value={progress.max ? (progress.value / progress.max) * 100 : progress.value} 
									className="h-2"
								/>
							</div>
						)}

						{actions && actions.length > 0 && (
							<div className="flex gap-2 mt-4">
								{actions.map((action, index) => (
									<Button
										key={index}
										variant={action.variant || "outline"}
										size="sm"
										onClick={action.onClick}
										className="text-xs"
									>
										{action.label}
									</Button>
								))}
							</div>
						)}
					</div>

					<div className={cn("w-12 h-12 rounded-xl flex items-center justify-center ml-4", iconBgColor)}>
						<Icon className={cn("w-6 h-6", iconColor)} />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
