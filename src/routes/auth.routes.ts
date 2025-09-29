import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

export const authRoutes = (): Router => {
    const router = Router();
    const controller = new AuthController();

    router.post('/login', controller.login);

    return router;
};
