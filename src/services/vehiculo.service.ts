import { VehiculoRepository } from '../repositories/vehiculo.repository';
import { createVehiculoSchema, updateVehiculoSchema } from '../validators';
import { handleDbError } from '../utils/dbErrors';
import { HttpError } from '../utils/httpError';
import { NewVehiculo, UpdateVehiculo, VehiculoWithCliente } from '../models';

export class VehiculoService {
    private readonly repo = new VehiculoRepository();

    async list(): Promise<VehiculoWithCliente[]> {
        return this.repo.findAll();
    }

    async getByMatricula(matricula: string): Promise<VehiculoWithCliente> {
        const vehiculo = await this.repo.findByMatricula(matricula);
        if (!vehiculo) {
            throw new HttpError(404, 'Vehículo no encontrado');
        }
        return vehiculo;
    }

    async create(payload: unknown): Promise<VehiculoWithCliente> {
        const data = createVehiculoSchema.parse(payload) as NewVehiculo;
        try {
            await this.repo.create(data);
            return this.getByMatricula(data.matricula);
        } catch (error) {
            handleDbError(error, 'No se pudo crear el vehículo');
            throw error;
        }
    }

    async update(matricula: string, payload: unknown): Promise<VehiculoWithCliente> {
        const data = updateVehiculoSchema.parse(payload) as UpdateVehiculo;
        const existing = await this.repo.findByMatricula(matricula);
        if (!existing) {
            throw new HttpError(404, 'Vehículo no encontrado');
        }

        try {
            const success = await this.repo.update(matricula, data);
            if (!success) {
                throw new HttpError(404, 'Vehículo no encontrado');
            }
            return this.getByMatricula(matricula);
        } catch (error) {
            handleDbError(error, 'No se pudo actualizar el vehículo');
            throw error;
        }
    }

    async delete(matricula: string): Promise<void> {
        try {
            const success = await this.repo.delete(matricula);
            if (!success) {
                throw new HttpError(404, 'Vehículo no encontrado');
            }
        } catch (error) {
            handleDbError(error, 'No se pudo eliminar el vehículo');
            throw error;
        }
    }

    async listByCliente(clienteId: number) {
        return this.repo.findByCliente(clienteId);
    }
}
