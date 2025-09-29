import { withTransaction } from '../db/pool';
import { DetalleReparacionRepository } from '../repositories/detalle.repository';
import { PiezaRepository } from '../repositories/pieza.repository';
import { ReparacionRepository } from '../repositories/reparacion.repository';
import { createDetalleSchema } from '../validators';
import { handleDbError } from '../utils/dbErrors';
import { HttpError } from '../utils/httpError';
import { DetalleReparacion, DetalleReparacionExtendido, NewDetalleReparacion } from '../models';

export class DetalleReparacionService {
    private readonly repo = new DetalleReparacionRepository();
    private readonly piezaRepo = new PiezaRepository();
    private readonly reparacionRepo = new ReparacionRepository();

    async listByFolio(folio: number): Promise<DetalleReparacionExtendido[]> {
        const reparacion = await this.reparacionRepo.findByFolio(folio);
        if (!reparacion) {
            throw new HttpError(404, 'Reparación no encontrada');
        }
        return this.repo.findExtendidoByFolio(folio);
    }

    async create(payload: unknown): Promise<DetalleReparacion> {
        const data = createDetalleSchema.parse(payload) as NewDetalleReparacion;

        const reparacion = await this.reparacionRepo.findByFolio(data.folio);
        if (!reparacion) {
            throw new HttpError(404, 'Reparación no encontrada');
        }

        const pieza = await this.piezaRepo.findById(data.piezaId);
        if (!pieza) {
            throw new HttpError(404, 'Pieza no encontrada');
        }

        return withTransaction(async connection => {
            const stockUpdated = await this.piezaRepo.updateStockTransaction(data.piezaId, -data.cantidad, connection);
            if (!stockUpdated) {
                throw new HttpError(409, 'Stock insuficiente para la pieza seleccionada');
            }

            try {
                return await this.repo.save(data, connection);
            } catch (error) {
                handleDbError(error, 'No se pudo crear el detalle de reparación');
                throw error;
            }
        });
    }

    async delete(id: number): Promise<void> {
        const detalle = await this.repo.findById(id);
        if (!detalle) {
            throw new HttpError(404, 'Detalle de reparación no encontrado');
        }

        await withTransaction(async connection => {
            const stockReturned = await this.piezaRepo.updateStockTransaction(detalle.piezaId, detalle.cantidad, connection);
            if (!stockReturned) {
                throw new HttpError(409, 'No se pudo devolver el stock de la pieza asociada');
            }

            try {
                const deleted = await this.repo.delete(id, connection);
                if (!deleted) {
                    throw new HttpError(404, 'Detalle de reparación no encontrado');
                }
            } catch (error) {
                handleDbError(error, 'No se pudo eliminar el detalle de reparación');
                throw error;
            }
        });
    }
}
