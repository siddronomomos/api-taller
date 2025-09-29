import { createUserSchema, updateUserSchema } from '../validators';
import { hashPassword } from '../utils/password';
import { UserRepository } from '../repositories/user.repository';
import { handleDbError } from '../utils/dbErrors';
import { HttpError } from '../utils/httpError';
import { User } from '../models';

const sanitize = (user: User): Omit<User, 'passwordHash'> => {
    const { passwordHash, ...rest } = user;
    return rest;
};

export class UserService {
    private readonly repo = new UserRepository();

    async list(): Promise<Array<Omit<User, 'passwordHash'>>> {
        const users = await this.repo.findAll();
        return users.map(sanitize);
    }

    async getById(id: number): Promise<Omit<User, 'passwordHash'>> {
        const user = await this.repo.findById(id);
        if (!user) {
            throw new HttpError(404, 'Usuario no encontrado');
        }
        return sanitize(user);
    }

    async create(payload: unknown): Promise<Omit<User, 'passwordHash'>> {
        const data = createUserSchema.parse(payload);

        const existing = await this.repo.findByUsername(data.userName);
        if (existing) {
            throw new HttpError(409, 'El nombre de usuario ya está registrado');
        }

        const passwordHash = await hashPassword(data.password);

        try {
            const created = await this.repo.create({
                nombre: data.nombre,
                userName: data.userName,
                perfil: data.perfil,
                passwordHash
            });
            return sanitize(created);
        } catch (error) {
            handleDbError(error, 'No se pudo crear el usuario');
            throw error;
        }
    }

    async update(id: number, payload: unknown): Promise<Omit<User, 'passwordHash'>> {
        const data = updateUserSchema.parse(payload);

        const user = await this.repo.findById(id);
        if (!user) {
            throw new HttpError(404, 'Usuario no encontrado');
        }

        if (user.userName !== data.userName) {
            const existing = await this.repo.findByUsername(data.userName);
            if (existing && existing.id !== id) {
                throw new HttpError(409, 'El nombre de usuario ya está registrado');
            }
        }

        const passwordHash = data.password ? await hashPassword(data.password) : undefined;

        try {
            const success = await this.repo.update(id, {
                nombre: data.nombre,
                userName: data.userName,
                perfil: data.perfil,
                passwordHash
            });

            if (!success) {
                throw new HttpError(404, 'Usuario no encontrado');
            }

            const updated = await this.repo.findById(id);
            if (!updated) {
                throw new HttpError(404, 'Usuario no encontrado');
            }
            return sanitize(updated);
        } catch (error) {
            handleDbError(error, 'No se pudo actualizar el usuario');
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const success = await this.repo.delete(id);
            if (!success) {
                throw new HttpError(404, 'Usuario no encontrado');
            }
        } catch (error) {
            handleDbError(error, 'No se pudo eliminar el usuario');
        }
    }
}
