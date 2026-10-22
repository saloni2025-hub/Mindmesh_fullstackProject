import { Router } from 'express';
import { listUsers, recommended, getUser, updateMe } from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();
router.use(protect);
router.get('/', listUsers);
router.get('/recommended', recommended);
router.put('/me', updateMe);
router.get('/:username', getUser);
export default router;