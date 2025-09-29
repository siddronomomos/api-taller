export interface Cliente {
    id: number;
    usuarioId: number;
    nombre: string;
    telefono: string;
    rfc: string;
    fechaRegistro: string;
}

export interface NewCliente {
    usuarioId: number;
    nombre: string;
    telefono: string;
    rfc: string;
}

export interface UpdateCliente {
    nombre: string;
    telefono: string;
    rfc: string;
}
