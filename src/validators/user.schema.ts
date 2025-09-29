import { z } from 'zod';

export const perfilSchema = z.enum(['admin', 'mecanico', 'aux']);

export const createUserSchema = z.object({
    nombre: z.string().min(3).max(30),
    userName: z.string().min(4).max(30),
    password: z.string().min(6),
    perfil: perfilSchema
});

export const updateUserSchema = createUserSchema.partial({
    password: true
}).extend({
    nombre: z.string().min(3).max(30),
    userName: z.string().min(4).max(30),
    perfil: perfilSchema
});
