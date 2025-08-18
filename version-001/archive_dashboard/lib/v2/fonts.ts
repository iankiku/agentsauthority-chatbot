import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

export const ibmPlexSans = IBM_Plex_Sans({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	variable: "--font-ibm-plex-sans",
	display: "swap",
	preload: true,
});

export const ibmPlexMono = IBM_Plex_Mono({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	variable: "--font-ibm-plex-mono",
	display: "swap",
	preload: true,
});
