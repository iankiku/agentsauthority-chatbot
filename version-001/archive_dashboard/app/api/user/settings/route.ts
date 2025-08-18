import { handleApiError } from "@/lib/api-errors";
import { db } from "@/lib/db";
// Legacy settings table is not exported; settings endpoints are disabled for now.
// import { userSettings } from "@workspace/database";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/user/settings - Get user settings
export async function GET(request: NextRequest) {
	try {
		// const session = await auth.api.getSession({
		// 	headers: request.headers,
		// });

		// if (!session?.user) {
		// 	throw new AuthenticationError("Please log in to access settings");
		// }

		const userId = "mock-user-id"; // Use a mock user ID for now

		const settings = await db.query.userSettings.findFirst({
			where: eq(userSettings.userId, userId),
		});

		// Return default settings if none exist
		if (!settings) {
			return NextResponse.json({
				theme: "light",
				emailNotifications: true,
				marketingEmails: false,
				defaultModel: "gpt-3.5-turbo",
				metadata: {},
			});
		}

		return NextResponse.json(settings);
	} catch (error) {
		return handleApiError(error);
	}
}

// PUT /api/user/settings - Update user settings
export async function PUT(request: NextRequest) {
	try {
		// const session = await auth.api.getSession({
		// 	headers: request.headers,
		// });

		// if (!session?.user) {
		// 	throw new AuthenticationError("Please log in to access settings");
		// }

		// TODO: remove this and all other mockData
		const userId = "mock-user-id"; // Use a mock user ID for now

		const data = await request.json();
		const {
			theme,
			emailNotifications,
			marketingEmails,
			defaultModel,
			metadata,
		} = data;

		// Validate theme
		if (theme && !["light", "dark"].includes(theme)) {
			return NextResponse.json(
				{ error: "Invalid theme value" },
				{ status: 400 }
			);
		}

		// Upsert user settings
		const [updatedSettings] = await db
			.insert(userSettings)
			.values({
				userId: userId,
				theme: theme || "light",
				emailNotifications: emailNotifications ?? true,
				marketingEmails: marketingEmails ?? false,
				defaultModel: defaultModel || "gpt-3.5-turbo",
				metadata: metadata || {},
			})
			.onConflictDoUpdate({
				target: userSettings.userId,
				set: {
					theme,
					emailNotifications,
					marketingEmails,
					defaultModel,
					metadata,
					updatedAt: new Date(),
				},
			})
			.returning();

		return NextResponse.json(updatedSettings);
	} catch (error) {
		return handleApiError(error);
	}
}

// PATCH /api/user/settings - Partial update
export async function PATCH(request: NextRequest) {
	try {
		// const session = await auth.api.getSession({
		// 	headers: request.headers,
		// });

		// if (!session?.user) {
		// 	throw new AuthenticationError("Please log in to access settings");
		// }

		const userId = "mock-user-id"; // Use a mock user ID for now

		const updates = await request.json();

		// Remove any fields that shouldn't be updated
		delete updates.id;
		delete updates.userId;
		delete updates.createdAt;

		// Validate theme if provided
		if (updates.theme && !["light", "dark"].includes(updates.theme)) {
			return NextResponse.json(
				{ error: "Invalid theme value" },
				{ status: 400 }
			);
		}

		if (Object.keys(updates).length === 0) {
			return NextResponse.json(
				{ error: "No valid fields to update" },
				{ status: 400 }
			);
		}

		// Check if settings exist
		const existingSettings = await db.query.userSettings.findFirst({
			where: eq(userSettings.userId, userId),
		});

		if (!existingSettings) {
			// Create new settings with partial data
			const [newSettings] = await db
				.insert(userSettings)
				.values({
					userId: userId,
					...updates,
				})
				.returning();

			return NextResponse.json(newSettings);
		}

		// Update existing settings
		const [updatedSettings] = await db
			.update(userSettings)
			.set({
				...updates,
				updatedAt: new Date(),
			})
			.where(eq(userSettings.userId, userId))
			.returning();

		return NextResponse.json(updatedSettings);
	} catch (error) {
		return handleApiError(error);
	}
}
