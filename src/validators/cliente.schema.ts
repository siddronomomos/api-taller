import { z } from 'zod';

export const createClienteSchema = z.object({
    usuarioId: z.number().int().positive(),
    nombre: z.string().min(3).max(30),
    telefono: z.string().regex(/^\d{10}$/),
    rfc: z.string().min(12).max(13).toUpperCase()
});

export const updateClienteSchema = createClienteSchema.pick({
    nombre: true,
    telefono: true,
    rfc: true
});
