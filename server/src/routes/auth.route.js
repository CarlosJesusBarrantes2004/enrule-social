import { Router } from 'express';
import { signup, signin } from '../controllers/auth.controller.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';

const router = Router();

router.post('/signup', validateSchema(registerSchema), signup);

router.post('/signin', validateSchema(loginSchema), signin);

export default router;
