export type EstadoReparacion = 'pendiente' | 'en_proceso' | 'completada';

export interface Reparacion {
    folio: number;
    matricula: string;
    fechaEntrada: string;
    fechaSalida: string | null;
    estado: EstadoReparacion;
}

export interface ReparacionDetalle extends Reparacion {
    infoVehiculo?: string;
    infoCliente?: string;
}

export interface NewReparacion {
    matricula: string;
    fechaEntrada: string;
    fechaSalida?: string | null;
    estado?: EstadoReparacion;
}

export interface UpdateReparacion {
    matricula: string;
    fechaEntrada: string;
    fechaSalida?: string | null;
    estado: EstadoReparacion;
}
