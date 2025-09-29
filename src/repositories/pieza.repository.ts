import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../db/pool';
import { NewPieza, Pieza, UpdatePieza } from '../models';

interface PiezaRow extends RowDataPacket {
    pieza_id: number;
    descripcion: string;
    existencias: number;
    precio: number;
}

const mapPieza = (row: PiezaRow): Pieza => ({
    id: row.pieza_id,
    descripcion: row.descripcion,
    existencias: row.existencias,
    precio: Number(row.precio)
});

export class PiezaRepository {
    async findAll(): Promise<Pieza[]> {
        const [rows] = await pool.query<PiezaRow[]>(
            'SELECT pieza_id, descripcion, existencias, precio FROM piezas ORDER BY descripcion'
        );
        return rows.map(mapPieza);
    }

    async findById(id: number): Promise<Pieza | null> {
        const [rows] = await pool.query<PiezaRow[]>(
            'SELECT pieza_id, descripcion, existencias, precio FROM piezas WHERE pieza_id = ?',
            [id]
        );
        if (rows.length === 0) {
            return null;
        }
        return mapPieza(rows[0]);
    }

    async create(data: NewPieza): Promise<Pieza> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO piezas (descripcion, existencias, precio) VALUES (?, ?, ?)',
            [data.descripcion, data.existencias, data.precio]
        );

        return {
            id: result.insertId,
            descripcion: data.descripcion,
            existencias: data.existencias,
            precio: data.precio
        };
    }

    async update(id: number, data: UpdatePieza): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE piezas SET descripcion = ?, existencias = ?, precio = ? WHERE pieza_id = ?',
            [data.descripcion, data.existencias, data.precio, id]
        );
        return result.affectedRows > 0;
    }

    async updateStock(id: number, delta: number): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE piezas SET existencias = existencias + ? WHERE pieza_id = ? AND existencias + ? >= 0',
            [delta, id, delta]
        );
        return result.affectedRows > 0;
    }

    async updateStockTransaction(id: number, delta: number, connection: PoolConnection): Promise<boolean> {
        const [result] = await connection.query<ResultSetHeader>(
            'UPDATE piezas SET existencias = existencias + ? WHERE pieza_id = ? AND existencias + ? >= 0',
            [delta, id, delta]
        );
        return result.affectedRows > 0;
    }

    async delete(id: number): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'DELETE FROM piezas WHERE pieza_id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}
