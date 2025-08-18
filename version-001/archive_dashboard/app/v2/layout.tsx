import { V2ResponsiveNavigation } from "../../components/v2/layout/v2-navigation";
import { ibmPlexMono, ibmPlexSans } from "../../lib/v2/fonts";
import "../../styles/v2/globals.css";

export const metadata = {
	title: "Fragment V2 - AI-Powered Brand Visibility",
	description:
		"Next-generation chat-driven dashboard for brand visibility analysis",
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
	// Note: Sub-layouts in Next.js App Router should not render <html>/<body>.
	// Wrap the subtree to scope IBM Plex font variables and theme styles.
	return (
		<div
			className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} v2-theme font-sans antialiased min-h-screen`}
		>
			{/* Navigation */}
			<V2ResponsiveNavigation />

			{/* Main content with spacing that avoids clipping and no footer */}
			<main className="pt-20 pb-8">{children}</main>
		</div>
	);
}
