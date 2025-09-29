import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { userRoutes } from './users.routes';
import { clienteRoutes } from './clientes.routes';
import { vehiculoRoutes } from './vehiculos.routes';
import { piezaRoutes } from './piezas.routes';
import { reparacionRoutes } from './reparaciones.routes';
import { detalleRoutes } from './detalles.routes';

export const registerRoutes = (): Router => {
    const router = Router();

    router.use('/auth', authRoutes());
    router.use('/users', userRoutes());
    router.use('/clientes', clienteRoutes());
    router.use('/vehiculos', vehiculoRoutes());
    router.use('/piezas', piezaRoutes());
    router.use('/reparaciones', reparacionRoutes());
    router.use('/detalles', detalleRoutes());

    return router;
};
