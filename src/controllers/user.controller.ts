import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { HttpError } from '../utils/httpError';

export class UserController {
    private readonly service = new UserService();

    list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const users = await this.service.list();
            res.json(users);
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = this.parseId(req.params.id);
            const user = await this.service.getById(id);
            res.json(user);
        } catch (error) {
            next(error);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = await this.service.create(req.body);
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = this.parseId(req.params.id);
            const user = await this.service.update(id, req.body);
            res.json(user);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = this.parseId(req.params.id);
            await this.service.delete(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };

    private parseId(raw: string): number {
        const id = Number(raw);
        if (Number.isNaN(id) || id <= 0) {
            throw new HttpError(400, 'El identificador debe ser un número positivo');
        }
        return id;
    }
}
