import { z } from 'zod';

export const createPiezaSchema = z.object({
    descripcion: z.string().min(3).max(500),
    existencias: z.number().int().min(0),
    precio: z.number().min(0)
});

export const updatePiezaSchema = createPiezaSchema;
