import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../db/pool';
import { NewVehiculo, UpdateVehiculo, Vehiculo, VehiculoWithCliente } from '../models';

interface VehiculoRow extends RowDataPacket {
    matricula: string;
    serie: string;
    modelo: string;
    marca: string;
    anio: number | null;
    cliente_id: number;
    cliente_nombre?: string;
}

const mapVehiculo = (row: VehiculoRow): Vehiculo => ({
    matricula: row.matricula,
    serie: row.serie,
    modelo: row.modelo,
    marca: row.marca,
    anio: row.anio,
    clienteId: row.cliente_id
});

export class VehiculoRepository {
    async findAll(): Promise<VehiculoWithCliente[]> {
        const [rows] = await pool.query<VehiculoRow[]>(
            `SELECT v.matricula, v.serie, v.modelo, v.marca, v.anio, v.cliente_id, c.nombre AS cliente_nombre
       FROM vehiculos v
       JOIN clientes c ON v.cliente_id = c.cliente_id
       ORDER BY v.marca, v.modelo`
        );
        return rows.map((row: VehiculoRow) => ({
            ...mapVehiculo(row),
            clienteNombre: row.cliente_nombre ?? ''
        }));
    }

    async findByMatricula(matricula: string): Promise<VehiculoWithCliente | null> {
        const [rows] = await pool.query<VehiculoRow[]>(
            `SELECT v.matricula, v.serie, v.modelo, v.marca, v.anio, v.cliente_id, c.nombre AS cliente_nombre
       FROM vehiculos v
       JOIN clientes c ON v.cliente_id = c.cliente_id
       WHERE v.matricula = ?`,
            [matricula]
        );
        if (rows.length === 0) {
            return null;
        }
        const row = rows[0];
        return { ...mapVehiculo(row), clienteNombre: row.cliente_nombre ?? '' };
    }

    async findByCliente(clienteId: number): Promise<Vehiculo[]> {
        const [rows] = await pool.query<VehiculoRow[]>(
            'SELECT matricula, serie, modelo, marca, anio, cliente_id FROM vehiculos WHERE cliente_id = ? ORDER BY marca, modelo',
            [clienteId]
        );
        return rows.map(mapVehiculo);
    }

    async create(data: NewVehiculo): Promise<Vehiculo> {
        await pool.query<ResultSetHeader>(
            `INSERT INTO vehiculos (matricula, serie, modelo, marca, anio, cliente_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [data.matricula, data.serie, data.modelo, data.marca, data.anio ?? null, data.clienteId]
        );

        return {
            matricula: data.matricula,
            serie: data.serie,
            modelo: data.modelo,
            marca: data.marca,
            anio: data.anio ?? null,
            clienteId: data.clienteId
        };
    }

    async update(matricula: string, data: UpdateVehiculo): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE vehiculos
       SET serie = ?, modelo = ?, marca = ?, anio = ?, cliente_id = ?
       WHERE matricula = ?`,
            [data.serie, data.modelo, data.marca, data.anio ?? null, data.clienteId, matricula]
        );
        return result.affectedRows > 0;
    }

    async delete(matricula: string): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'DELETE FROM vehiculos WHERE matricula = ?',
            [matricula]
        );
        return result.affectedRows > 0;
    }
}
