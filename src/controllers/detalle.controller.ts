import { Request, Response, NextFunction } from 'express';
import { DetalleReparacionService } from '../services/detalle.service';
import { HttpError } from '../utils/httpError';

export class DetalleReparacionController {
    private readonly service = new DetalleReparacionService();

    listByFolio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const folio = this.parseId(req.params.folio, 'folio');
            const detalles = await this.service.listByFolio(folio);
            res.json(detalles);
        } catch (error) {
            next(error);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const detalle = await this.service.create(req.body);
            res.status(201).json(detalle);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = this.parseId(req.params.id, 'detalle');
            await this.service.delete(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };

    private parseId(raw: string, label: string): number {
        const id = Number(raw);
        if (Number.isNaN(id) || id <= 0) {
            throw new HttpError(400, `El identificador de ${label} debe ser un número positivo`);
        }
        return id;
    }
}
