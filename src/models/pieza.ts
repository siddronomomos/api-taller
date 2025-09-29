export interface Pieza {
    id: number;
    descripcion: string;
    existencias: number;
    precio: number;
}

export interface NewPieza {
    descripcion: string;
    existencias: number;
    precio: number;
}

export interface UpdatePieza {
    descripcion: string;
    existencias: number;
    precio: number;
}
