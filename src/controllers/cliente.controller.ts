import { Request, Response, NextFunction } from 'express';
import { ClienteService } from '../services/cliente.service';
import { HttpError } from '../utils/httpError';

export class ClienteController {
    private readonly service = new ClienteService();

    list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const clientes = await this.service.list();
            res.json(clientes);
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = this.parseId(req.params.id);
            const cliente = await this.service.getById(id);
            res.json(cliente);
        } catch (error) {
            next(error);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const cliente = await this.service.create(req.body);
            res.status(201).json(cliente);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = this.parseId(req.params.id);
            const cliente = await this.service.update(id, req.body);
            res.json(cliente);
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
