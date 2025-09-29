import { Router } from 'express';
import { PiezaController } from '../controllers/pieza.controller';

export const piezaRoutes = (): Router => {
    const router = Router();
    const controller = new PiezaController();

    router.get('/', controller.list);
    router.get('/:id', controller.getById);
    router.post('/', controller.create);
    router.put('/:id', controller.update);
    router.patch('/:id/stock', controller.updateStock);
    router.delete('/:id', controller.delete);

    return router;
};
