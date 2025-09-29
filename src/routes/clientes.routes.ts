import { Router } from 'express';
import { ClienteController } from '../controllers/cliente.controller';

export const clienteRoutes = (): Router => {
    const router = Router();
    const controller = new ClienteController();

    router.get('/', controller.list);
    router.get('/:id', controller.getById);
    router.post('/', controller.create);
    router.put('/:id', controller.update);
    router.delete('/:id', controller.delete);

    return router;
};
