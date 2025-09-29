import { Router } from 'express';
import { DetalleReparacionController } from '../controllers/detalle.controller';

export const detalleRoutes = (): Router => {
    const router = Router();
    const controller = new DetalleReparacionController();

    router.get('/folio/:folio', controller.listByFolio);
    router.post('/', controller.create);
    router.delete('/:id', controller.delete);

    return router;
};
