import { Request, Response, NextFunction } from 'express';
import { ReparacionService } from '../services/reparacion.service';
import { HttpError } from '../utils/httpError';

export class ReparacionController {
    private readonly service = new ReparacionService();

    list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const reparaciones = await this.service.list();
            res.json(reparaciones);
        } catch (error) {
            next(error);
        }
    };

    listByVehiculo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const matricula = this.parseMatricula(req.params.matricula);
            const reparaciones = await this.service.listByVehiculo(matricula);
            res.json(reparaciones);
        } catch (error) {
            next(error);
        }
    };

    getByFolio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const folio = this.parseFolio(req.params.folio);
            const reparacion = await this.service.getByFolio(folio);
            res.json(reparacion);
        } catch (error) {
            next(error);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const reparacion = await this.service.create(req.body);
            res.status(201).json(reparacion);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const folio = this.parseFolio(req.params.folio);
            const reparacion = await this.service.update(folio, req.body);
            res.json(reparacion);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const folio = this.parseFolio(req.params.folio);
            await this.service.delete(folio);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };

    private parseFolio(raw: string): number {
        const folio = Number(raw);
        if (Number.isNaN(folio) || folio <= 0) {
            throw new HttpError(400, 'El folio debe ser un número positivo');
        }
        return folio;
    }

    private parseMatricula(raw: string): string {
        if (!raw || raw.length < 6) {
            throw new HttpError(400, 'Debe proporcionar una matrícula válida');
        }
        return raw.toUpperCase();
    }
}
