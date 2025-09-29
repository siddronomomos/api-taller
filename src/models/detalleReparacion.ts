export interface DetalleReparacion {
    id: number;
    folio: number;
    piezaId: number;
    cantidad: number;
    precioUnitario: number;
}

export interface DetalleReparacionExtendido extends DetalleReparacion {
    descripcionPieza: string;
    precioActual: number;
}

export interface NewDetalleReparacion {
    folio: number;
    piezaId: number;
    cantidad: number;
    precioUnitario: number;
}
