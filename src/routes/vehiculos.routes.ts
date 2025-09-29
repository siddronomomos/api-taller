import { Router } from 'express';
import { VehiculoController } from '../controllers/vehiculo.controller';

export const vehiculoRoutes = (): Router => {
    const router = Router();
    const controller = new VehiculoController();

    router.get('/', controller.list);
    router.get('/cliente/:clienteId', controller.listByCliente);
    router.get('/:matricula', controller.getByMatricula);
    router.post('/', controller.create);
    router.put('/:matricula', controller.update);
    router.delete('/:matricula', controller.delete);

    return router;
};
