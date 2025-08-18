import { Router } from 'express';
import { apiMiddleware } from '../middleware/api-middleware';
import { getUserProfile, updateUserProfile, partialUpdateUserProfile } from '../services/user-service';
import { getUserSettings, updateUserSettings, partialUpdateUserSettings } from '../services/user-service';

const router = Router();

// User Profile routes
router.get('/profile', apiMiddleware(), getUserProfile);
router.put('/profile', apiMiddleware(), updateUserProfile);
router.patch('/profile', apiMiddleware(), partialUpdateUserProfile);

// User Settings routes
router.get('/settings', apiMiddleware(), getUserSettings);
router.put('/settings', apiMiddleware(), updateUserSettings);
router.patch('/settings', apiMiddleware(), partialUpdateUserSettings);

export { router as userRouter };
