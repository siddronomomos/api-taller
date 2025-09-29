import { z } from 'zod';

export const createDetalleSchema = z.object({
    folio: z.number().int().positive(),
    piezaId: z.number().int().positive(),
    cantidad: z.number().int().positive(),
    precioUnitario: z.number().min(0)
});
