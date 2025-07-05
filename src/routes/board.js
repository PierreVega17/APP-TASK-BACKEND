import express from 'express';
import { getBoards, createBoard, getBoardUsers, deleteBoard } from '../controllers/boardController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getBoards);
router.post('/', authenticateToken, createBoard);
router.get('/:id/users', authenticateToken, getBoardUsers);
router.delete('/:id', authenticateToken, deleteBoard);

export default router;
