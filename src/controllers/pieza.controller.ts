import { Request, Response, NextFunction } from 'express';
import { PiezaService } from '../services/pieza.service';
import { HttpError } from '../utils/httpError';

export class PiezaController {
    private readonly service = new PiezaService();

    list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const piezas = await this.service.list();
            res.json(piezas);
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = this.parseId(req.params.id);
            const pieza = await this.service.getById(id);
            res.json(pieza);
        } catch (error) {
            next(error);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const pieza = await this.service.create(req.body);
            res.status(201).json(pieza);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = this.parseId(req.params.id);
            const pieza = await this.service.update(id, req.body);
            res.json(pieza);
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

    updateStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = this.parseId(req.params.id);
            const delta = this.parseDelta(req.body?.delta);
            const pieza = await this.service.updateStock(id, delta);
            res.json(pieza);
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

    private parseDelta(raw: unknown): number {
        const delta = typeof raw === 'string' ? Number(raw) : (raw as number);
        if (typeof delta !== 'number' || Number.isNaN(delta) || !Number.isFinite(delta)) {
            throw new HttpError(400, 'Debe proporcionar un ajuste de inventario válido');
        }
        if (!Number.isInteger(delta)) {
            throw new HttpError(400, 'El ajuste de inventario debe ser un número entero');
        }
        if (delta === 0) {
            throw new HttpError(400, 'El ajuste de inventario no puede ser cero');
        }
        return delta;
    }
}
