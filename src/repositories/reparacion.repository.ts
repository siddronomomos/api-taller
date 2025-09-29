import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool, withTransaction } from '../db/pool';
import { NewReparacion, Reparacion, ReparacionDetalle, UpdateReparacion } from '../models';
import { DetalleReparacionRepository } from './detalle.repository';
import { PiezaRepository } from './pieza.repository';

interface ReparacionRow extends RowDataPacket {
    folio: number;
    matricula: string;
    fecha_entrada: string;
    fecha_salida: string | null;
    estado: 'pendiente' | 'en_proceso' | 'completada';
    marca?: string;
    modelo?: string;
    cliente_nombre?: string;
}

const mapReparacion = (row: ReparacionRow): Reparacion => ({
    folio: row.folio,
    matricula: row.matricula,
    fechaEntrada: row.fecha_entrada,
    fechaSalida: row.fecha_salida,
    estado: row.estado
});

const detalleRepo = new DetalleReparacionRepository();
const piezaRepo = new PiezaRepository();

export class ReparacionRepository {
    async findAll(): Promise<ReparacionDetalle[]> {
        const [rows] = await pool.query<ReparacionRow[]>(
            `SELECT r.folio, r.matricula, r.fecha_entrada, r.fecha_salida, r.estado,
              v.marca, v.modelo, c.nombre AS cliente_nombre
       FROM reparaciones r
       JOIN vehiculos v ON r.matricula = v.matricula
       JOIN clientes c ON v.cliente_id = c.cliente_id
       ORDER BY r.fecha_entrada DESC`
        );
        return rows.map((row: ReparacionRow) => ({
            ...mapReparacion(row),
            infoVehiculo: row.marca && row.modelo ? `${row.marca} ${row.modelo}` : undefined,
            infoCliente: row.cliente_nombre
        }));
    }

    async findByFolio(folio: number): Promise<ReparacionDetalle | null> {
        const [rows] = await pool.query<ReparacionRow[]>(
            `SELECT r.folio, r.matricula, r.fecha_entrada, r.fecha_salida, r.estado,
              v.marca, v.modelo, c.nombre AS cliente_nombre
       FROM reparaciones r
       JOIN vehiculos v ON r.matricula = v.matricula
       JOIN clientes c ON v.cliente_id = c.cliente_id
       WHERE r.folio = ?`,
            [folio]
        );
        if (rows.length === 0) {
            return null;
        }
        const row = rows[0];
        return {
            ...mapReparacion(row),
            infoVehiculo: row.marca && row.modelo ? `${row.marca} ${row.modelo}` : undefined,
            infoCliente: row.cliente_nombre
        };
    }

    async findByVehiculo(matricula: string): Promise<Reparacion[]> {
        const [rows] = await pool.query<ReparacionRow[]>(
            'SELECT folio, matricula, fecha_entrada, fecha_salida, estado FROM reparaciones WHERE matricula = ? ORDER BY fecha_entrada DESC',
            [matricula]
        );
        return rows.map(mapReparacion);
    }

    async create(data: NewReparacion): Promise<Reparacion> {
        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO reparaciones (matricula, fecha_entrada, fecha_salida, estado)
       VALUES (?, ?, ?, ?)`,
            [data.matricula, data.fechaEntrada, data.fechaSalida ?? null, data.estado ?? 'pendiente']
        );

        return {
            folio: result.insertId,
            matricula: data.matricula,
            fechaEntrada: data.fechaEntrada,
            fechaSalida: data.fechaSalida ?? null,
            estado: data.estado ?? 'pendiente'
        };
    }

    async update(folio: number, data: UpdateReparacion): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE reparaciones
       SET matricula = ?, fecha_entrada = ?, fecha_salida = ?, estado = ?
       WHERE folio = ?`,
            [data.matricula, data.fechaEntrada, data.fechaSalida ?? null, data.estado, folio]
        );
        return result.affectedRows > 0;
    }

    async delete(folio: number): Promise<boolean> {
        return withTransaction(async connection => {
            const detalles = await detalleRepo.findByFolio(folio, connection);

            for (const detalle of detalles) {
                const ok = await piezaRepo.updateStockTransaction(detalle.piezaId, detalle.cantidad, connection);
                if (!ok) {
                    throw new Error('No se pudo devolver stock de una pieza');
                }
            }

            await detalleRepo.deleteByFolio(folio, connection);

            const [result] = await connection.query<ResultSetHeader>(
                'DELETE FROM reparaciones WHERE folio = ?',
                [folio]
            );
            return result.affectedRows > 0;
        });
    }
}
