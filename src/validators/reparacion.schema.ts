import { z } from 'zod';

const estadoSchema = z.enum(['pendiente', 'en_proceso', 'completada']);

export const createReparacionSchema = z.object({
    matricula: z.string().min(6).max(10).toUpperCase(),
    fechaEntrada: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    fechaSalida: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
    estado: estadoSchema.optional()
});

export const updateReparacionSchema = createReparacionSchema.extend({
    estado: estadoSchema
});
