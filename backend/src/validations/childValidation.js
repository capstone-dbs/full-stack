import Joi from 'joi';

export const childSchema = Joi.object({
  full_name: Joi.string().required(),

  gender: Joi.string()
    .valid('Laki-laki', 'Perempuan')
    .required(),

  birth_date: Joi.date().required()
});