"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { useSession } from "@/lib/auth-client";
import { User, Mail, Calendar } from "lucide-react";

export default function ProfilePage() {
	const { data: session } = useSession();

	return (
		<DashboardLayout title="Profile">
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Profile</h1>
					<p className="text-muted-foreground">
						Manage your account settings and preferences
					</p>
				</div>

				<div className="grid gap-6">
					<Card>
						<CardHeader>
							<CardTitle>Personal Information</CardTitle>
							<CardDescription>
								Update your personal details and profile information
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="flex items-center gap-4">
								<Avatar className="h-20 w-20">
									<AvatarImage 
										src={session?.user?.image || undefined} 
										alt={session?.user?.name || "User"} 
									/>
									<AvatarFallback className="bg-primary/10 text-primary text-lg">
										{session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
									</AvatarFallback>
								</Avatar>
								<div>
									<Button variant="outline" size="sm">
										Change Avatar
									</Button>
									<p className="text-xs text-muted-foreground mt-1">
										JPG, PNG or GIF. Max size 2MB.
									</p>
								</div>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="name">Full Name</Label>
									<Input 
										id="name" 
										defaultValue={session?.user?.name || ""} 
										placeholder="Enter your full name"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input 
										id="email" 
										type="email" 
										defaultValue={session?.user?.email || ""} 
										placeholder="Enter your email"
									/>
								</div>
							</div>

							<div className="flex justify-end">
								<Button>Save Changes</Button>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Account Information</CardTitle>
							<CardDescription>
								View your account details and membership status
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center gap-3">
								<User className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="text-sm font-medium">Account Type</p>
									<p className="text-sm text-muted-foreground">Professional Plan</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<Mail className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="text-sm font-medium">Email Status</p>
									<p className="text-sm text-muted-foreground">Verified</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<Calendar className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="text-sm font-medium">Member Since</p>
									<p className="text-sm text-muted-foreground">January 2024</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</DashboardLayout>
	);
}
