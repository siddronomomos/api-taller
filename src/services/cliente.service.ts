import { ClienteRepository } from '../repositories/cliente.repository';
import { createClienteSchema, updateClienteSchema } from '../validators';
import { handleDbError } from '../utils/dbErrors';
import { HttpError } from '../utils/httpError';
import { Cliente, NewCliente, UpdateCliente } from '../models';

export class ClienteService {
    private readonly repo = new ClienteRepository();

    async list(): Promise<Cliente[]> {
        return this.repo.findAll();
    }

    async getById(id: number): Promise<Cliente> {
        const cliente = await this.repo.findById(id);
        if (!cliente) {
            throw new HttpError(404, 'Cliente no encontrado');
        }
        return cliente;
    }

    async create(payload: unknown): Promise<Cliente> {
        const data = createClienteSchema.parse(payload) as NewCliente;
        try {
            return await this.repo.create(data);
        } catch (error) {
            handleDbError(error, 'No se pudo crear el cliente');
            throw error;
        }
    }

    async update(id: number, payload: unknown): Promise<Cliente> {
        const data = updateClienteSchema.parse(payload) as UpdateCliente;
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new HttpError(404, 'Cliente no encontrado');
        }

        try {
            const success = await this.repo.update(id, data);
            if (!success) {
                throw new HttpError(404, 'Cliente no encontrado');
            }
            return this.getById(id);
        } catch (error) {
            handleDbError(error, 'No se pudo actualizar el cliente');
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const success = await this.repo.delete(id);
            if (!success) {
                throw new HttpError(404, 'Cliente no encontrado');
            }
        } catch (error) {
            handleDbError(error, 'No se pudo eliminar el cliente');
            throw error;
        }
    }
}
