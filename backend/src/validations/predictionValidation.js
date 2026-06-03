import Joi from 'joi';

export const predictionSchema = Joi.object({
  child_id: Joi.string().uuid().required(),

  weight: Joi.number()
    .positive()
    .required(),

  height: Joi.number()
    .positive()
    .required(),

  measurement_date: Joi.date().required()
});