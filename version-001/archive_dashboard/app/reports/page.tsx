"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@workspace/ui/components/select";
import { Separator } from "@workspace/ui/components/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import {
	ArrowRight,
	BarChart3,
	Calendar,
	Clock,
	Download,
	Eye,
	FileText,
	Filter,
	Globe,
	Search,
	TrendingUp,
	Users,
} from "lucide-react";
import Link from "next/link";

const reports = [
	{
		id: "1",
		title: "Monthly Visibility Report",
		type: "Visibility",
		date: "2024-01-15",
		status: "completed",
		description: "Comprehensive AI visibility analysis across all platforms",
		metrics: { score: 73, change: "+5%" },
		icon: Eye,
		color: "text-blue-500",
		bgColor: "bg-blue-500/10",
	},
	{
		id: "2",
		title: "Competitor Analysis Q1 2024",
		type: "Competitor",
		date: "2024-01-10",
		status: "completed",
		description: "Detailed competitive landscape analysis",
		metrics: { rank: "#2", change: "+1" },
		icon: Users,
		color: "text-primary",
		bgColor: "bg-primary/10",
	},
	{
		id: "3",
		title: "Brand Performance Dashboard",
		type: "Performance",
		date: "2024-01-08",
		status: "completed",
		description: "Overall brand performance across AI platforms",
		metrics: { score: 78, change: "+3%" },
		icon: BarChart3,
		color: "text-green-500",
		bgColor: "bg-green-500/10",
	},
	{
		id: "4",
		title: "Weekly Trend Analysis",
		type: "Visibility",
		date: "2024-01-05",
		status: "processing",
		description: "Weekly visibility trends and insights",
		metrics: { score: 71, change: "+2%" },
		icon: TrendingUp,
		color: "text-orange-500",
		bgColor: "bg-orange-500/10",
	},
	{
		id: "5",
		title: "Brand Mention Report",
		type: "Brand",
		date: "2024-01-03",
		status: "completed",
		description: "Analysis of brand mentions across AI platforms",
		metrics: { mentions: 1247, change: "+15%" },
		icon: Globe,
		color: "text-indigo-500",
		bgColor: "bg-indigo-500/10",
	},
];

const reportTypes = [
	{ value: "all", label: "All Reports" },
	{ value: "visibility", label: "Visibility Reports" },
	{ value: "competitor", label: "Competitor Reports" },
	{ value: "performance", label: "Performance Reports" },
	{ value: "brand", label: "Brand Reports" },
];

export default function ReportsPage() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<div className="flex items-center space-x-2">
						<FileText className="w-5 h-5" />
						<h1 className="text-lg font-semibold">Reports</h1>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4">
					{/* Header Actions */}
					<div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
						<div>
							<h2 className="text-2xl font-bold">All Reports</h2>
							<p className="text-muted-foreground">
								View and manage your analysis reports
							</p>
						</div>
						<div className="flex gap-2">
							<Button variant="outline">
								<Download className="w-4 h-4 mr-2" />
								Export All
							</Button>
							<Button className="bg-orange-500 hover:bg-orange-600">
								<FileText className="w-4 h-4 mr-2" />
								Generate Report
							</Button>
						</div>
					</div>

					{/* Filters */}
					<Card>
						<CardContent className="p-4">
							<div className="flex flex-col sm:flex-row gap-4">
								<div className="flex-1">
									<div className="relative">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
										<Input placeholder="Search reports..." className="pl-10" />
									</div>
								</div>
								<Select defaultValue="all">
									<SelectTrigger className="w-full sm:w-48">
										<SelectValue placeholder="Report Type" />
									</SelectTrigger>
									<SelectContent>
										{reportTypes.map((type) => (
											<SelectItem key={type.value} value={type.value}>
												{type.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Select defaultValue="30">
									<SelectTrigger className="w-full sm:w-32">
										<SelectValue placeholder="Period" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="7">Last 7 days</SelectItem>
										<SelectItem value="30">Last 30 days</SelectItem>
										<SelectItem value="90">Last 90 days</SelectItem>
									</SelectContent>
								</Select>
								<Button variant="outline" size="icon">
									<Filter className="w-4 h-4" />
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Quick Stats */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-muted-foreground">
											Total Reports
										</p>
										<p className="text-2xl font-bold">24</p>
									</div>
									<FileText className="w-8 h-8 text-muted-foreground" />
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-muted-foreground">This Month</p>
										<p className="text-2xl font-bold">8</p>
									</div>
									<Calendar className="w-8 h-8 text-muted-foreground" />
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-muted-foreground">Processing</p>
										<p className="text-2xl font-bold">2</p>
									</div>
									<Clock className="w-8 h-8 text-muted-foreground" />
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-muted-foreground">Avg Score</p>
										<p className="text-2xl font-bold">74</p>
									</div>
									<TrendingUp className="w-8 h-8 text-muted-foreground" />
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Reports List */}
					<div className="space-y-4">
						{reports.map((report) => {
							const Icon = report.icon;
							return (
								<Card
									key={report.id}
									className="hover:shadow-md transition-shadow"
								>
									<CardContent className="p-6">
										<div className="flex items-start justify-between">
											<div className="flex items-start space-x-4">
												<div
													className={`w-12 h-12 ${report.bgColor} rounded-lg flex items-center justify-center`}
												>
													<Icon className={`w-6 h-6 ${report.color}`} />
												</div>
												<div className="flex-1">
													<div className="flex items-center space-x-2 mb-1">
														<h3 className="text-lg font-semibold">
															{report.title}
														</h3>
														<Badge
															variant={
																report.status === "completed"
																	? "default"
																	: "secondary"
															}
															className={
																report.status === "completed"
																	? "bg-green-500/10 text-green-600 border-green-500/20"
																	: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
															}
														>
															{report.status === "completed"
																? "Completed"
																: "Processing"}
														</Badge>
													</div>
													<p className="text-muted-foreground mb-2">
														{report.description}
													</p>
													<div className="flex items-center space-x-4 text-sm text-muted-foreground">
														<span>Type: {report.type}</span>
														<span>•</span>
														<span>
															Generated:{" "}
															{new Date(report.date).toLocaleDateString()}
														</span>
														<span>•</span>
														<span>
															{report.metrics.score &&
																`Score: ${report.metrics.score}`}
															{report.metrics.rank &&
																`Rank: ${report.metrics.rank}`}
															{report.metrics.mentions &&
																`Mentions: ${report.metrics.mentions}`}
															<span className="text-green-600 ml-1">
																{report.metrics.change}
															</span>
														</span>
													</div>
												</div>
											</div>
											<div className="flex items-center space-x-2">
												<Button variant="outline" size="sm">
													<Download className="w-4 h-4 mr-2" />
													Export
												</Button>
												<Link
													href={`/reports/${report.type.toLowerCase()}/${report.id}`}
												>
													<Button size="sm">
														View Report
														<ArrowRight className="w-4 h-4 ml-2" />
													</Button>
												</Link>
											</div>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>

					{/* Pagination */}
					<div className="flex items-center justify-between">
						<p className="text-sm text-muted-foreground">
							Showing 5 of 24 reports
						</p>
						<div className="flex items-center space-x-2">
							<Button variant="outline" size="sm" disabled>
								Previous
							</Button>
							<Button variant="outline" size="sm">
								Next
							</Button>
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
