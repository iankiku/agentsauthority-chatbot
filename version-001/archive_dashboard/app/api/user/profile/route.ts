import { handleApiError } from "@/lib/api-errors";
import { db } from "@/lib/db";
// These legacy imports no longer exist in the shared database package.
// The profile/settings logic is currently disabled; keeping imports commented to avoid build failures.
// import { userProfile, userSettings } from "@workspace/database";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/user/profile - Get user profile and settings
export async function GET(request: NextRequest) {
	try {
		// const session = await auth.api.getSession({
		// 	headers: request.headers,
		// });

		// if (!session?.user) {
		// 	throw new AuthenticationError("Please log in to access your profile");
		// }

		// TODO: remove this and all other mockData
		const userId = "mock-user-id"; // Use a mock user ID for now

		// Get user profile with settings
		const profile = await db.query.userProfile.findFirst({
			where: eq(userProfile.userId, userId),
		});

		const settings = await db.query.userSettings.findFirst({
			where: eq(userSettings.userId, userId),
		});

		return NextResponse.json({
			profile: profile || null,
			settings: settings || null,
			user: {
				id: userId,
				email: "mock@example.com", // Mock email
			},
		});
	} catch (error) {
		return handleApiError(error);
	}
}

// PUT /api/user/profile - Update user profile
export async function PUT(request: NextRequest) {
	try {
		// const session = await auth.api.getSession({
		// 	headers: request.headers,
		// });

		// if (!session?.user) {
		// 	throw new AuthenticationError("Please log in to access your profile");
		// }

		const userId = "mock-user-id"; // Use a mock user ID for now
		const data = await request.json();
		const { displayName, avatarUrl, bio, phone } = data;

		// Upsert user profile
		const [updatedProfile] = await db
			.insert(userProfile)
			.values({
				userId: userId,
				displayName,
				avatarUrl,
				bio,
				phone,
			})
			.onConflictDoUpdate({
				target: userProfile.userId,
				set: {
					displayName,
					avatarUrl,
					bio,
					phone,
					updatedAt: new Date(),
				},
			})
			.returning();

		return NextResponse.json(updatedProfile);
	} catch (error) {
		return handleApiError(error);
	}
}

// PATCH /api/user/profile - Partial update
export async function PATCH(request: NextRequest) {
	try {
		// const session = await auth.api.getSession({
		// 	headers: request.headers,
		// });

		// if (!session?.user) {
		// 	throw new AuthenticationError("Please log in to access your profile");
		// }

		const userId = "mock-user-id"; // Use a mock user ID for now
		const updates = await request.json();

		// Remove any fields that shouldn't be updated
		delete updates.id;
		delete updates.userId;
		delete updates.createdAt;

		if (Object.keys(updates).length === 0) {
			return NextResponse.json(
				{ error: "No valid fields to update" },
				{ status: 400 }
			);
		}

		// Check if profile exists
		const existingProfile = await db.query.userProfile.findFirst({
			where: eq(userProfile.userId, userId),
		});

		if (!existingProfile) {
			// Create new profile with partial data
			const [newProfile] = await db
				.insert(userProfile)
				.values({
					userId: userId,
					...updates,
				})
				.returning();

			return NextResponse.json(newProfile);
		}

		// Update existing profile
		const [updatedProfile] = await db
			.update(userProfile)
			.set({
				...updates,
				updatedAt: new Date(),
			})
			.where(eq(userProfile.userId, userId))
			.returning();

		return NextResponse.json(updatedProfile);
	} catch (error) {
		return handleApiError(error);
	}
}
