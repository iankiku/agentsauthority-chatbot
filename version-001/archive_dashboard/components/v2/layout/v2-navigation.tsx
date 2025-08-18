"use client";

import { Button } from "@workspace/ui";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { 
	navigationItems, 
	useNavigationState, 
	isValidNavigationSection 
} from "../../../lib/v2/navigation-state";

interface V2NavigationProps {
	className?: string;
}

export function V2Navigation({ className }: V2NavigationProps) {
	const pathname = usePathname();
	const { activeSection, setActiveSection } = useNavigationState();

	// Update active section based on current path
	useEffect(() => {
		const currentSection = pathname.split("/").pop() || "chat";
		if (isValidNavigationSection(currentSection) && currentSection !== activeSection) {
			setActiveSection(currentSection);
		}
	}, [pathname, activeSection, setActiveSection]);

	return (
		<motion.nav
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${className}`}
		>
			<div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full px-2 py-1 shadow-lg">
				<div className="flex items-center space-x-1">
					{navigationItems.map((item) => {
						const isActive = activeSection === item.id;
						
						return (
							<Link key={item.id} href={item.path}>
								<Button
									variant="ghost"
									size="sm"
									className={`
										relative rounded-full px-4 py-2 transition-all duration-200
										${isActive
											? "text-white shadow-sm"
											: "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
										}
									`}
									onClick={() => setActiveSection(item.id)}
								>
									{/* Active background */}
									{isActive && (
										<motion.div
											layoutId="activeBackground"
											className="absolute inset-0 bg-orange-500 rounded-full"
											initial={false}
											transition={{
												type: "spring",
												stiffness: 500,
												damping: 30,
											}}
										/>
									)}
									
									{/* Button text */}
									<span className="relative z-10 font-medium text-sm">
										{item.label}
									</span>
								</Button>
							</Link>
						);
					})}
				</div>
			</div>
		</motion.nav>
	);
}

// Mobile navigation component for smaller screens
export function V2MobileNavigation({ className }: V2NavigationProps) {
	const pathname = usePathname();
	const { activeSection, setActiveSection } = useNavigationState();

	// Update active section based on current path
	useEffect(() => {
		const currentSection = pathname.split("/").pop() || "chat";
		if (isValidNavigationSection(currentSection) && currentSection !== activeSection) {
			setActiveSection(currentSection);
		}
	}, [pathname, activeSection, setActiveSection]);

	return (
		<motion.nav
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className={`fixed bottom-4 left-4 right-4 z-50 md:hidden ${className}`}
		>
			<div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl px-4 py-2 shadow-lg">
				<div className="flex items-center justify-between space-x-1">
					{navigationItems.slice(0, 4).map((item) => {
						const isActive = activeSection === item.id;
						
						return (
							<Link key={item.id} href={item.path} className="flex-1">
								<Button
									variant="ghost"
									size="sm"
									className={`
										relative w-full rounded-xl px-2 py-3 transition-all duration-200
										${isActive
											? "text-white shadow-sm"
											: "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
										}
									`}
									onClick={() => setActiveSection(item.id)}
								>
									{/* Active background */}
									{isActive && (
										<motion.div
											layoutId="mobileActiveBackground"
											className="absolute inset-0 bg-orange-500 rounded-xl"
											initial={false}
											transition={{
												type: "spring",
												stiffness: 500,
												damping: 30,
											}}
										/>
									)}
									
									{/* Button text */}
									<span className="relative z-10 font-medium text-xs">
										{item.label}
									</span>
								</Button>
							</Link>
						);
					})}
				</div>
			</div>
		</motion.nav>
	);
}

// Combined navigation component that shows appropriate version based on screen size
export function V2ResponsiveNavigation({ className }: V2NavigationProps) {
	return (
		<>
			{/* Desktop Navigation */}
			<div className="hidden md:block">
				<V2Navigation className={className} />
			</div>
			
			{/* Mobile Navigation */}
			<div className="block md:hidden">
				<V2MobileNavigation className={className} />
			</div>
		</>
	);
}
