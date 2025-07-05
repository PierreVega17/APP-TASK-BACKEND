import express from 'express';
import { getInvites, respondInvite } from '../controllers/notificationController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getInvites);
router.post('/:inviteId', authenticateToken, respondInvite);

export default router;
