"use client";

import { memo } from "react";

interface ProgressBarProps {
	percentage: number;
	message: string;
	stage: string;
}

function PureProgressBar({ percentage, message, stage }: ProgressBarProps) {
	return (
		<div className="w-full bg-white-200 rounded-full h-2.5 dark:bg-gray-700">
			<div
				className="bg-orange-500 h-2.5 rounded-full"
				style={{ width: `${percentage}%` }}
			></div>
			<div className="text-xs text-gray-500 mt-1">
				{stage}: {message}
			</div>
		</div>
	);
}

export const ProgressBar = memo(PureProgressBar);
