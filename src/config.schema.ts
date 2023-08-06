import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
    DATABASE_URL: Joi.string().required(),
    BIKES_API:Joi.string().required(),
    WEATHER_API: Joi.string().required(),
    ACCESS_TOKEN: Joi.string().required()
});