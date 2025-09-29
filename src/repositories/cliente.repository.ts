import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../db/pool';
import { Cliente, NewCliente, UpdateCliente } from '../models';

interface ClienteRow extends RowDataPacket {
    cliente_id: number;
    usuario_id: number;
    nombre: string;
    telefono: string;
    rfc: string;
    fecha_registro: string;
}

const mapCliente = (row: ClienteRow): Cliente => ({
    id: row.cliente_id,
    usuarioId: row.usuario_id,
    nombre: row.nombre,
    telefono: row.telefono,
    rfc: row.rfc,
    fechaRegistro: row.fecha_registro
});

export class ClienteRepository {
    async findAll(): Promise<Cliente[]> {
        const [rows] = await pool.query<ClienteRow[]>(
            'SELECT cliente_id, usuario_id, nombre, telefono, rfc, fecha_registro FROM clientes ORDER BY nombre'
        );
        return rows.map(mapCliente);
    }

    async findById(id: number): Promise<Cliente | null> {
        const [rows] = await pool.query<ClienteRow[]>(
            'SELECT cliente_id, usuario_id, nombre, telefono, rfc, fecha_registro FROM clientes WHERE cliente_id = ?',
            [id]
        );
        if (rows.length === 0) {
            return null;
        }
        return mapCliente(rows[0]);
    }

    async create(data: NewCliente): Promise<Cliente> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO clientes (usuario_id, nombre, telefono, rfc) VALUES (?, ?, ?, ?)',
            [data.usuarioId, data.nombre, data.telefono, data.rfc]
        );

        return {
            id: result.insertId,
            usuarioId: data.usuarioId,
            nombre: data.nombre,
            telefono: data.telefono,
            rfc: data.rfc,
            fechaRegistro: new Date().toISOString().split('T')[0]
        };
    }

    async update(id: number, data: UpdateCliente): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE clientes SET nombre = ?, telefono = ?, rfc = ? WHERE cliente_id = ?',
            [data.nombre, data.telefono, data.rfc, id]
        );
        return result.affectedRows > 0;
    }

    async delete(id: number): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'DELETE FROM clientes WHERE cliente_id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}
