import { z } from 'zod';

export const createVehiculoSchema = z.object({
    matricula: z.string().min(6).max(10).toUpperCase(),
    serie: z.string().min(5).max(20),
    modelo: z.string().min(2).max(20),
    marca: z.string().min(2).max(20),
    anio: z.number().int().min(1900).max(new Date().getFullYear()).nullable().optional(),
    clienteId: z.number().int().positive()
});

export const updateVehiculoSchema = createVehiculoSchema.pick({
    serie: true,
    modelo: true,
    marca: true,
    anio: true,
    clienteId: true
});
