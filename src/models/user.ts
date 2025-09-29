export type Perfil = 'admin' | 'mecanico' | 'aux';

export interface User {
    id: number;
    nombre: string;
    userName: string;
    perfil: Perfil;
    passwordHash: string;
}

export interface NewUser {
    nombre: string;
    userName: string;
    perfil: Perfil;
    password: string;
}

export interface CreateUserParams {
    nombre: string;
    userName: string;
    perfil: Perfil;
    passwordHash: string;
}

export interface UpdateUser {
    nombre: string;
    userName: string;
    perfil: Perfil;
    password?: string;
}

export interface UpdateUserParams {
    nombre: string;
    userName: string;
    perfil: Perfil;
    passwordHash?: string;
}
