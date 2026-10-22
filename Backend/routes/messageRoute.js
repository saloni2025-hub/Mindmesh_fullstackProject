import { Router } from 'express';
import { getConversations, getChat, sendMessage } from '../controllers/messageController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();
router.use(protect);
router.get('/', getConversations);
router.get('/:username', getChat);
router.post('/:username', sendMessage);
export default router;