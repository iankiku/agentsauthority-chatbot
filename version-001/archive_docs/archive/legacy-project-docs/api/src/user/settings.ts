import { Request, Response, Router } from 'express';
import { auth } from '../auth/auth';
import { db } from '../db';
import { userSettings } from '../db/schema';
import { eq } from 'drizzle-orm';
import { handleApiError, AuthenticationError } from '../lib/api-errors';

const router = Router();

// GET /api/user/settings - Get user settings
router.get('/', async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });

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
});

// PATCH /api/user/settings - Partial update
router.patch('/', async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });

    if (!session?.user) {
      throw new AuthenticationError('Please log in to access settings');
    }

    const updates = req.body;
    
    delete updates.id;
    delete updates.userId;
    delete updates.createdAt;

    if (updates.theme && !['light', 'dark'].includes(updates.theme)) {
      return res.status(400).json({ error: 'Invalid theme value' });
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
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
});

export const settingsRouter = router;
