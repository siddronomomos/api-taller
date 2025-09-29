import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/httpError';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof HttpError) {
        res.status(err.status).json({
            message: err.message,
            details: err.details ?? null
        });
        return;
    }

    console.error('[UNHANDLED_ERROR]', err);
    res.status(500).json({ message: 'Error interno del servidor' });
};
