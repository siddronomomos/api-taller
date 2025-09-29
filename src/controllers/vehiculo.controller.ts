import { Request, Response, NextFunction } from 'express';
import { VehiculoService } from '../services/vehiculo.service';
import { HttpError } from '../utils/httpError';

export class VehiculoController {
    private readonly service = new VehiculoService();

    list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const vehiculos = await this.service.list();
            res.json(vehiculos);
        } catch (error) {
            next(error);
        }
    };

    listByCliente = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const clienteId = this.parseId(req.params.clienteId);
            const vehiculos = await this.service.listByCliente(clienteId);
            res.json(vehiculos);
        } catch (error) {
            next(error);
        }
    };

    getByMatricula = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const matricula = this.parseMatricula(req.params.matricula);
            const vehiculo = await this.service.getByMatricula(matricula);
            res.json(vehiculo);
        } catch (error) {
            next(error);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const vehiculo = await this.service.create(req.body);
            res.status(201).json(vehiculo);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const matricula = this.parseMatricula(req.params.matricula);
            const vehiculo = await this.service.update(matricula, req.body);
            res.json(vehiculo);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const matricula = this.parseMatricula(req.params.matricula);
            await this.service.delete(matricula);
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

    private parseMatricula(raw: string): string {
        if (!raw || raw.length < 6) {
            throw new HttpError(400, 'Debe proporcionar una matrícula válida');
        }
        return raw.toUpperCase();
    }
}
