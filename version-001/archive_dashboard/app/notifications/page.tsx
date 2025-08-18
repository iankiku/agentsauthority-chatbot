"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { Bell, Check, X } from "lucide-react";

export default function NotificationsPage() {
	const notifications = [
		{
			id: "1",
			title: "Analysis Complete",
			message: "Your brand analysis for ACME Corp has been completed.",
			timestamp: "2 hours ago",
			read: false,
			type: "success" as const,
		},
		{
			id: "2",
			title: "Competitor Alert",
			message: "TechFlow Inc. has improved their visibility score by 15%.",
			timestamp: "4 hours ago",
			read: false,
			type: "warning" as const,
		},
		{
			id: "3",
			title: "Weekly Report Ready",
			message: "Your weekly performance report is now available.",
			timestamp: "1 day ago",
			read: true,
			type: "info" as const,
		},
	];

	return (
		<DashboardLayout title="Notifications">
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
						<p className="text-muted-foreground">
							Stay updated with your latest activity and alerts
						</p>
					</div>
					<Button variant="outline" size="sm">
						<Check className="mr-2 h-4 w-4" />
						Mark all as read
					</Button>
				</div>

				<div className="space-y-4">
					{notifications.map((notification) => (
						<Card
							key={notification.id}
							className={`transition-colors ${
								!notification.read ? "bg-muted/50" : ""
							}`}
						>
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<div className="flex items-start gap-3">
										<div
											className={`mt-1 p-2 rounded-full ${
												notification.type === "success"
													? "bg-green-100 text-green-600"
													: notification.type === "warning"
													? "bg-yellow-100 text-yellow-600"
													: "bg-blue-100 text-blue-600"
											}`}
										>
											<Bell className="h-4 w-4" />
										</div>
										<div className="space-y-1">
											<div className="flex items-center gap-2">
												<CardTitle className="text-base">
													{notification.title}
												</CardTitle>
												{!notification.read && (
													<Badge variant="secondary" className="text-xs">
														New
													</Badge>
												)}
											</div>
											<CardDescription className="text-sm">
												{notification.message}
											</CardDescription>
											<p className="text-xs text-muted-foreground">
												{notification.timestamp}
											</p>
										</div>
									</div>
									<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
										<X className="h-4 w-4" />
									</Button>
								</div>
							</CardHeader>
						</Card>
					))}
				</div>

				{notifications.length === 0 && (
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-12">
							<Bell className="h-12 w-12 text-muted-foreground mb-4" />
							<h3 className="text-lg font-semibold mb-2">No notifications</h3>
							<p className="text-muted-foreground text-center">
								You're all caught up! We'll notify you when there's something new.
							</p>
						</CardContent>
					</Card>
				)}
			</div>
		</DashboardLayout>
	);
}
