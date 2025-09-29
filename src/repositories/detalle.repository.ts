import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../db/pool';
import { DetalleReparacion, DetalleReparacionExtendido, NewDetalleReparacion } from '../models';

interface DetalleRow extends RowDataPacket {
    detalle_id: number;
    folio: number;
    pieza_id: number;
    cantidad: number;
    precio_unitario: number;
    pieza_descripcion?: string;
    precio_actual?: number;
}

const mapDetalle = (row: DetalleRow): DetalleReparacion => ({
    id: row.detalle_id,
    folio: row.folio,
    piezaId: row.pieza_id,
    cantidad: row.cantidad,
    precioUnitario: Number(row.precio_unitario)
});

const mapExtendido = (row: DetalleRow): DetalleReparacionExtendido => ({
    ...mapDetalle(row),
    descripcionPieza: row.pieza_descripcion ?? '',
    precioActual: Number(row.precio_actual ?? row.precio_unitario)
});

const queryRunner = async <T>(
    executor: (connection: PoolConnection) => Promise<T>,
    connection?: PoolConnection
): Promise<T> => {
    if (connection) {
        return executor(connection);
    }
    const conn = await pool.getConnection();
    try {
        return await executor(conn);
    } finally {
        conn.release();
    }
};

export class DetalleReparacionRepository {
    async findByFolio(folio: number, connection?: PoolConnection): Promise<DetalleReparacion[]> {
        return queryRunner(async conn => {
            const [rows] = await conn.query<DetalleRow[]>(
                'SELECT detalle_id, folio, pieza_id, cantidad, precio_unitario FROM detalle_reparaciones WHERE folio = ? ORDER BY detalle_id',
                [folio]
            );
            return rows.map(mapDetalle);
        }, connection);
    }

    async findById(id: number, connection?: PoolConnection): Promise<DetalleReparacion | null> {
        return queryRunner(async conn => {
            const [rows] = await conn.query<DetalleRow[]>(
                'SELECT detalle_id, folio, pieza_id, cantidad, precio_unitario FROM detalle_reparaciones WHERE detalle_id = ?',
                [id]
            );
            if (rows.length === 0) {
                return null;
            }
            return mapDetalle(rows[0]);
        }, connection);
    }

    async findExtendidoByFolio(folio: number): Promise<DetalleReparacionExtendido[]> {
        const [rows] = await pool.query<DetalleRow[]>(
            `SELECT d.detalle_id, d.folio, d.pieza_id, d.cantidad, d.precio_unitario,
              p.descripcion AS pieza_descripcion, p.precio AS precio_actual
       FROM detalle_reparaciones d
       JOIN piezas p ON d.pieza_id = p.pieza_id
       WHERE d.folio = ?
       ORDER BY d.detalle_id`,
            [folio]
        );
        return rows.map(mapExtendido);
    }

    async save(data: NewDetalleReparacion, connection?: PoolConnection): Promise<DetalleReparacion> {
        return queryRunner(async conn => {
            const [result] = await conn.query<ResultSetHeader>(
                'INSERT INTO detalle_reparaciones (folio, pieza_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                [data.folio, data.piezaId, data.cantidad, data.precioUnitario]
            );
            return {
                id: result.insertId,
                folio: data.folio,
                piezaId: data.piezaId,
                cantidad: data.cantidad,
                precioUnitario: data.precioUnitario
            };
        }, connection);
    }

    async delete(id: number, connection?: PoolConnection): Promise<boolean> {
        return queryRunner(async conn => {
            const [result] = await conn.query<ResultSetHeader>(
                'DELETE FROM detalle_reparaciones WHERE detalle_id = ?',
                [id]
            );
            return result.affectedRows > 0;
        }, connection);
    }

    async deleteByFolio(folio: number, connection?: PoolConnection): Promise<void> {
        await queryRunner(async conn => {
            await conn.query('DELETE FROM detalle_reparaciones WHERE folio = ?', [folio]);
        }, connection);
    }
}
