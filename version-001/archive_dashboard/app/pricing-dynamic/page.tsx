"use client";

import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

function DynamicPricingContent() {
	return (
		<div className="min-h-screen bg-gray-50 py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold mb-4">Pricing</h1>
					<p className="text-xl text-gray-600">
						Billing is not available in this build.
					</p>
				</div>
			</div>
		</div>
	);
}

export default function DynamicPricingPage() {
	const { isPending } = useSession();

	if (isPending) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-gray-500" />
			</div>
		);
	}

	return <DynamicPricingContent />;
}
