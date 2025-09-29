import { UserRepository } from '../repositories/user.repository';
import { verifyPassword } from '../utils/password';
import { HttpError } from '../utils/httpError';
import { User } from '../models';

export class AuthService {
    private readonly repo = new UserRepository();

    async login(userName: string, password: string): Promise<Omit<User, 'passwordHash'>> {
        const user = await this.repo.findByUsername(userName);
        if (!user) {
            throw new HttpError(401, 'Credenciales inválidas');
        }

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) {
            throw new HttpError(401, 'Credenciales inválidas');
        }

        const { passwordHash, ...rest } = user;
        return rest;
    }
}
