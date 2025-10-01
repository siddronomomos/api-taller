import mysql from 'mysql2/promise';
import { env } from '../config/env';

export const pool = mysql.createPool({
    host: env.dbHost,
    user: env.dbUser,
    port: env.dbPort,
    password: env.dbPassword,
    database: env.dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: 'Z'
});

export const withTransaction = async <T>(handler: (conn: mysql.PoolConnection) => Promise<T>): Promise<T> => {
    const connection = await pool.getConnection().catch((err) => {
        console.error('Error getting database connection:', err);
        throw err;
    });

    try {
        await connection.beginTransaction();
        const result = await handler(connection);
        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};
