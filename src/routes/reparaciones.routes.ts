import { Router } from 'express';
import { ReparacionController } from '../controllers/reparacion.controller';

export const reparacionRoutes = (): Router => {
    const router = Router();
    const controller = new ReparacionController();

    router.get('/', controller.list);
    router.get('/vehiculo/:matricula', controller.listByVehiculo);
    router.get('/:folio', controller.getByFolio);
    router.post('/', controller.create);
    router.put('/:folio', controller.update);
    router.delete('/:folio', controller.delete);

    return router;
};
