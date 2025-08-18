import { Request, Response } from 'express';
import { db } from '../lib/db';
import { userProfile, userSettings } from '../db/schema';
import { eq } from 'drizzle-orm';
import { handleApiError, AuthenticationError, ValidationError } from '../lib/api-errors';

// GET /api/user/profile - Get user profile and settings
export async function getUserProfile(req: Request, res: Response) {
  try {
    const session = (req as any).session;
    if (!session?.user) {
      throw new AuthenticationError('Please log in to access your profile');
    }

    const profile = await db.query.userProfile.findFirst({
      where: eq(userProfile.userId, session.user.id),
    });

    const settings = await db.query.userSettings.findFirst({
      where: eq(userSettings.userId, session.user.id),
    });

    res.json({
      profile: profile || null,
      settings: settings || null,
      user: {
        id: session.user.id,
        email: session.user.email,
      },
    });
  } catch (error) {
    const handledError = handleApiError(error);
    res.status(handledError.status).json(handledError.body);
  }
}

// PUT /api/user/profile - Update user profile
export async function updateUserProfile(req: Request, res: Response) {
  try {
    const session = (req as any).session;
    if (!session?.user) {
      throw new AuthenticationError('Please log in to access your profile');
    }

    const data = req.body;
    const { displayName, avatarUrl, bio, phone } = data;

    const [updatedProfile] = await db
      .insert(userProfile)
      .values({
        userId: session.user.id,
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

    res.json(updatedProfile);
  } catch (error) {
    const handledError = handleApiError(error);
    res.status(handledError.status).json(handledError.body);
  }
}

// PATCH /api/user/profile - Partial update
export async function partialUpdateUserProfile(req: Request, res: Response) {
  try {
    const session = (req as any).session;
    if (!session?.user) {
      throw new AuthenticationError('Please log in to access your profile');
    }

    const updates = req.body;
    
    delete updates.id;
    delete updates.userId;
    delete updates.createdAt;

    if (Object.keys(updates).length === 0) {
      throw new ValidationError('No valid fields to update');
    }

    const existingProfile = await db.query.userProfile.findFirst({
      where: eq(userProfile.userId, session.user.id),
    });

    if (!existingProfile) {
      const [newProfile] = await db
        .insert(userProfile)
        .values({
          userId: session.user.id,
          ...updates,
        })
        .returning();
      
      return res.json(newProfile);
    }

    const [updatedProfile] = await db
      .update(userProfile)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(userProfile.userId, session.user.id))
      .returning();

    res.json(updatedProfile);
  } catch (error) {
    const handledError = handleApiError(error);
    res.status(handledError.status).json(handledError.body);
  }
}

// GET /api/user/settings - Get user settings
export async function getUserSettings(req: Request, res: Response) {
  try {
    const session = (req as any).session;
    if (!session?.user) {
      throw new AuthenticationError('Please log in to access settings');
    }

    const settings = await db.query.userSettings.findFirst({
      where: eq(userSettings.userId, session.user.id),
    });

    if (!settings) {
      return res.json({
        theme: 'light',
        emailNotifications: true,
        marketingEmails: false,
        defaultModel: 'gpt-3.5-turbo',
        metadata: {},
      });
    }

    res.json(settings);
  } catch (error) {
    const handledError = handleApiError(error);
    res.status(handledError.status).json(handledError.body);
  }
}

// PUT /api/user/settings - Update user settings
export async function updateUserSettings(req: Request, res: Response) {
  try {
    const session = (req as any).session;
    if (!session?.user) {
      throw new AuthenticationError('Please log in to access settings');
    }

    const data = req.body;
    const { theme, emailNotifications, marketingEmails, defaultModel, metadata } = data;

    if (theme && !['light', 'dark'].includes(theme)) {
      throw new ValidationError('Invalid theme value');
    }

    const [updatedSettings] = await db
      .insert(userSettings)
      .values({
        userId: session.user.id,
        theme: theme || 'light',
        emailNotifications: emailNotifications ?? true,
        marketingEmails: marketingEmails ?? false,
        defaultModel: defaultModel || 'gpt-3.5-turbo',
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

    res.json(updatedSettings);
  } catch (error) {
    const handledError = handleApiError(error);
    res.status(handledError.status).json(handledError.body);
  }
}

// PATCH /api/user/settings - Partial update
export async function partialUpdateUserSettings(req: Request, res: Response) {
  try {
    const session = (req as any).session;
    if (!session?.user) {
      throw new AuthenticationError('Please log in to access settings');
    }

    const updates = req.body;
    
    delete updates.id;
    delete updates.userId;
    delete updates.createdAt;

    if (updates.theme && !['light', 'dark'].includes(updates.theme)) {
      throw new ValidationError('Invalid theme value');
    }

    if (Object.keys(updates).length === 0) {
      throw new ValidationError('No valid fields to update');
    }

    const existingSettings = await db.query.userSettings.findFirst({
      where: eq(userSettings.userId, session.user.id),
    });

    if (!existingSettings) {
      const [newSettings] = await db
        .insert(userSettings)
        .values({
          userId: session.user.id,
          ...updates,
        })
        .returning();
      
      return res.json(newSettings);
    }

    const [updatedSettings] = await db
      .update(userSettings)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(userSettings.userId, session.user.id))
      .returning();

    res.json(updatedSettings);
  } catch (error) {
    const handledError = handleApiError(error);
    res.status(handledError.status).json(handledError.body);
  }
}
