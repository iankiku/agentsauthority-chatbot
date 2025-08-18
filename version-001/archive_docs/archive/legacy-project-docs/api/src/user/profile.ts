import { Request, Response, Router } from 'express';
import { auth } from '../auth/auth';
import { db } from '../db';
import { userProfile } from '../db/schema';
import { eq } from 'drizzle-orm';
import { handleApiError, AuthenticationError } from '../lib/api-errors';

const router = Router();

// GET /api/user/profile - Get user profile and settings
router.get('/', async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });

    if (!session?.user) {
      throw new AuthenticationError('Please log in to access your profile');
    }

    const profile = await db.query.userProfile.findFirst({
      where: eq(userProfile.userId, session.user.id),
    });

    res.json({
      profile: profile || null,
      user: {
        id: session.user.id,
        email: session.user.email,
      },
    });
  } catch (error) {
    const handledError = handleApiError(error);
    res.status(handledError.status).json(handledError.body);
  }
});

// PATCH /api/user/profile - Partial update
router.patch('/', async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });

    if (!session?.user) {
      throw new AuthenticationError('Please log in to access your profile');
    }

    const updates = req.body;
    
    delete updates.id;
    delete updates.userId;
    delete updates.createdAt;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
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
});

export const profileRouter = router;
