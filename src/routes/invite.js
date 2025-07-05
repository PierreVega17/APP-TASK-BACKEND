import express from 'express';
import { inviteUser } from '../controllers/inviteController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/:boardId', authenticateToken, inviteUser);

export default router;
