import express from 'express';

import validate from '../middlewares/validate.js';

import {
  registerSchema,
  loginSchema
} from '../validations/authValidation.js';

import {
  register,
  login,
  logout,
  resetPassword
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);

export default router;