import { Router } from 'express';
import { listSessions, createSession, updateSession, rateSession } from '../controllers/sessionController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();
router.use(protect);
router.get('/', listSessions);
router.post('/', createSession);
router.patch('/:id', updateSession);
router.post('/:id/rate', rateSession);
export default router;