import { ReparacionRepository } from '../repositories/reparacion.repository';
import { VehiculoRepository } from '../repositories/vehiculo.repository';
import { DetalleReparacionRepository } from '../repositories/detalle.repository';
import { createReparacionSchema, updateReparacionSchema } from '../validators';
import { handleDbError } from '../utils/dbErrors';
import { HttpError } from '../utils/httpError';
import {
    NewReparacion,
    Reparacion,
    ReparacionDetalle,
    UpdateReparacion,
    DetalleReparacionExtendido
} from '../models';

interface ReparacionFull extends ReparacionDetalle {
    detalles: DetalleReparacionExtendido[];
}

export class ReparacionService {
    private readonly repo = new ReparacionRepository();
    private readonly vehiculoRepo = new VehiculoRepository();
    private readonly detalleRepo = new DetalleReparacionRepository();

    async list(): Promise<ReparacionDetalle[]> {
        return this.repo.findAll();
    }

    async listByVehiculo(matricula: string): Promise<Reparacion[]> {
        return this.repo.findByVehiculo(matricula);
    }

    async getByFolio(folio: number): Promise<ReparacionFull> {
        const reparacion = await this.repo.findByFolio(folio);
        if (!reparacion) {
            throw new HttpError(404, 'Reparación no encontrada');
        }
        const detalles = await this.detalleRepo.findExtendidoByFolio(folio);
        return { ...reparacion, detalles };
    }

    async create(payload: unknown): Promise<ReparacionFull> {
        const data = createReparacionSchema.parse(payload) as NewReparacion;

        await this.ensureVehiculoExists(data.matricula);
        this.ensureFechasValidas(data.fechaEntrada, data.fechaSalida ?? null);

        try {
            const created = await this.repo.create(data);
            return this.getByFolio(created.folio);
        } catch (error) {
            handleDbError(error, 'No se pudo crear la reparación');
            throw error;
        }
    }

    async update(folio: number, payload: unknown): Promise<ReparacionFull> {
        const data = updateReparacionSchema.parse(payload) as UpdateReparacion;
        await this.ensureVehiculoExists(data.matricula);
        this.ensureFechasValidas(data.fechaEntrada, data.fechaSalida ?? null);

        const existing = await this.repo.findByFolio(folio);
        if (!existing) {
            throw new HttpError(404, 'Reparación no encontrada');
        }

        try {
            const success = await this.repo.update(folio, data);
            if (!success) {
                throw new HttpError(404, 'Reparación no encontrada');
            }
            return this.getByFolio(folio);
        } catch (error) {
            handleDbError(error, 'No se pudo actualizar la reparación');
            throw error;
        }
    }

    async delete(folio: number): Promise<void> {
        try {
            const success = await this.repo.delete(folio);
            if (!success) {
                throw new HttpError(404, 'Reparación no encontrada');
            }
        } catch (error) {
            handleDbError(error, 'No se pudo eliminar la reparación');
            throw error;
        }
    }

    private async ensureVehiculoExists(matricula: string): Promise<void> {
        const vehiculo = await this.vehiculoRepo.findByMatricula(matricula);
        if (!vehiculo) {
            throw new HttpError(400, 'El vehículo indicado no existe');
        }
    }

    private ensureFechasValidas(fechaEntrada: string, fechaSalida: string | null): void {
        if (!fechaSalida) {
            return;
        }
        const entrada = new Date(fechaEntrada);
        const salida = new Date(fechaSalida);
        if (Number.isNaN(entrada.getTime()) || Number.isNaN(salida.getTime())) {
            throw new HttpError(400, 'Las fechas proporcionadas no son válidas');
        }
        if (salida < entrada) {
            throw new HttpError(400, 'La fecha de salida no puede ser anterior a la fecha de entrada');
        }
    }
}
