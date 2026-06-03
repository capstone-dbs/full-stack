  import express from 'express';

  import authMiddleware from '../middlewares/authMiddleware.js';

  import validate from '../middlewares/validate.js';

  import { predictionSchema } from '../validations/predictionValidation.js';

  import {
    createPrediction,
    getPredictionHistories,
    getPredictionById,
    deletePrediction
  } from '../controllers/predictionController.js';

  const router = express.Router();

  router.post(
    '/',
    authMiddleware,
    validate(predictionSchema),
    createPrediction
  );

  router.get('/histories',
    authMiddleware,
    getPredictionHistories
  );

  router.get(
    '/:id',
    authMiddleware,
    getPredictionById
  );

  router.delete(
    '/:id',
    authMiddleware,
    deletePrediction
  );

  export default router;