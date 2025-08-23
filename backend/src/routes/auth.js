import express from 'express';
import AuthController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validateChangePassword
} from '../utils/validation.js';

const router = express.Router();

/**
 * Authentication Routes
 */

// Public routes
router.post('/register', validateRegister, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.post('/refresh', AuthController.refreshToken);

// Protected routes (require authentication)
router.use(authenticate); // All routes below require authentication

router.get('/me', AuthController.getProfile);
router.put('/me', validateProfileUpdate, AuthController.updateProfile);
router.delete('/me', AuthController.deactivateAccount);

router.post('/logout', AuthController.logout);
router.post('/logout-all', AuthController.logoutAll);
router.put('/change-password', validateChangePassword, AuthController.changePassword);

export default router;
