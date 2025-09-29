export interface Vehiculo {
    matricula: string;
    serie: string;
    modelo: string;
    marca: string;
    anio: number | null;
    clienteId: number;
}

export interface VehiculoWithCliente extends Vehiculo {
    clienteNombre: string;
}

export interface NewVehiculo {
    matricula: string;
    serie: string;
    modelo: string;
    marca: string;
    anio?: number | null;
    clienteId: number;
}

export interface UpdateVehiculo {
    serie: string;
    modelo: string;
    marca: string;
    anio?: number | null;
    clienteId: number;
}
