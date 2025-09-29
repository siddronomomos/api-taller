import { PiezaRepository } from '../repositories/pieza.repository';
import { createPiezaSchema, updatePiezaSchema } from '../validators';
import { handleDbError } from '../utils/dbErrors';
import { HttpError } from '../utils/httpError';
import { NewPieza, Pieza, UpdatePieza } from '../models';

export class PiezaService {
    private readonly repo = new PiezaRepository();

    async list(): Promise<Pieza[]> {
        return this.repo.findAll();
    }

    async getById(id: number): Promise<Pieza> {
        const pieza = await this.repo.findById(id);
        if (!pieza) {
            throw new HttpError(404, 'Pieza no encontrada');
        }
        return pieza;
    }

    async create(payload: unknown): Promise<Pieza> {
        const data = createPiezaSchema.parse(payload) as NewPieza;
        try {
            return await this.repo.create(data);
        } catch (error) {
            handleDbError(error, 'No se pudo crear la pieza');
            throw error;
        }
    }

    async update(id: number, payload: unknown): Promise<Pieza> {
        const data = updatePiezaSchema.parse(payload) as UpdatePieza;
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new HttpError(404, 'Pieza no encontrada');
        }

        try {
            const success = await this.repo.update(id, data);
            if (!success) {
                throw new HttpError(404, 'Pieza no encontrada');
            }
            return this.getById(id);
        } catch (error) {
            handleDbError(error, 'No se pudo actualizar la pieza');
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const success = await this.repo.delete(id);
            if (!success) {
                throw new HttpError(404, 'Pieza no encontrada');
            }
        } catch (error) {
            handleDbError(error, 'No se pudo eliminar la pieza');
            throw error;
        }
    }

    async updateStock(id: number, delta: number): Promise<Pieza> {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new HttpError(404, 'Pieza no encontrada');
        }

        try {
            const success = await this.repo.updateStock(id, delta);
            if (!success) {
                throw new HttpError(400, 'No se pudo actualizar el stock (verifique existencias)');
            }
            return this.getById(id);
        } catch (error) {
            handleDbError(error, 'No se pudo actualizar el stock');
            throw error;
        }
    }
}
