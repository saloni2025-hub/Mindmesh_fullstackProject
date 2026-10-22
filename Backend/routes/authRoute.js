import { Router } from 'express';
import { signup, login, getMe, verifyEmail, resendOtp } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOtp);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;