import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../db/pool';
import { Perfil, User, CreateUserParams, UpdateUserParams } from '../models';

interface UserRow extends RowDataPacket {
    usuario_id: number;
    nombre: string;
    user_name: string;
    password: string;
    perfil: Perfil;
}

const mapUser = (row: UserRow): User => ({
    id: row.usuario_id,
    nombre: row.nombre,
    userName: row.user_name,
    perfil: row.perfil,
    passwordHash: row.password
});

export class UserRepository {
    async findAll(): Promise<User[]> {
        const [rows] = await pool.query<UserRow[]>(
            'SELECT usuario_id, nombre, user_name, password, perfil FROM usuarios ORDER BY nombre'
        );
        return rows.map(mapUser);
    }

    async findById(id: number): Promise<User | null> {
        const [rows] = await pool.query<UserRow[]>(
            'SELECT usuario_id, nombre, user_name, password, perfil FROM usuarios WHERE usuario_id = ?',
            [id]
        );
        if (rows.length === 0) {
            return null;
        }
        return mapUser(rows[0]);
    }

    async findByUsername(username: string): Promise<User | null> {
        const [rows] = await pool.query<UserRow[]>(
            'SELECT usuario_id, nombre, user_name, password, perfil FROM usuarios WHERE user_name = ?',
            [username]
        );
        if (rows.length === 0) {
            return null;
        }
        return mapUser(rows[0]);
    }

    async create(data: CreateUserParams): Promise<User> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO usuarios (nombre, user_name, password, perfil) VALUES (?, ?, ?, ?)',
            [data.nombre, data.userName, data.passwordHash, data.perfil]
        );
        return {
            id: result.insertId,
            nombre: data.nombre,
            userName: data.userName,
            perfil: data.perfil,
            passwordHash: data.passwordHash
        };
    }

    async update(id: number, data: UpdateUserParams): Promise<boolean> {
        const fields: string[] = ['nombre = ?', 'user_name = ?', 'perfil = ?'];
        const values: unknown[] = [data.nombre, data.userName, data.perfil];

        if (data.passwordHash) {
            fields.push('password = ?');
            values.push(data.passwordHash);
        }

        values.push(id);

        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE usuarios SET ${fields.join(', ')} WHERE usuario_id = ?`,
            values
        );
        return result.affectedRows > 0;
    }

    async delete(id: number): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'DELETE FROM usuarios WHERE usuario_id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}
