//* Validation
import { Request } from "express";
import Joi from "joi";

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

const registerValidation = (data: RegisterRequestBody) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(6).max(255).email().required(),
    password: Joi.string().min(6).max(255).required(),
  });

  return schema.validate(data);
};

export default registerValidation;
