import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';

import {
  createChild,
  getChildren,
  getChildById,
  updateChild,
  deleteChild
} from '../controllers/childController.js';

import validate from '../middlewares/validate.js'; 

import { childSchema } from '../validations/childValidation.js';

const router = express.Router();

router.post('/',authMiddleware,validate(childSchema),createChild);
router.get('/',authMiddleware,getChildren);
router.get('/:id',authMiddleware,getChildById);
router.put('/:id',authMiddleware,validate(childSchema),updateChild);
router.delete('/:id',authMiddleware,deleteChild);

export default router;