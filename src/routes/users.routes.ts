import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

export const userRoutes = (): Router => {
    const router = Router();
    const controller = new UserController();

    router.get('/', controller.list);
    router.get('/:id', controller.getById);
    router.post('/', controller.create);
    router.put('/:id', controller.update);
    router.delete('/:id', controller.delete);

    return router;
};
