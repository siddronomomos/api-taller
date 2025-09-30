import { config as loadEnv } from 'dotenv';
import path from 'path';

loadEnv({ path: path.resolve(process.cwd(), '.env') });

const required = (value: string | undefined, key: string): string => {
    if (!value) {
        throw new Error(`La variable de entorno ${key} es obligatoria`);
    }
    return value;
};

export const env = {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '4000', 10),
    dbHost: required(process.env.DB_HOST, 'DB_HOST'),
    dbUser: required(process.env.DB_USER, 'DB_USER'),
    dbPort: parseInt(process.env.DB_PORT ?? '3306', 10),
    dbPassword: process.env.DB_PASSWORD ?? '',
    dbName: required(process.env.DB_NAME, 'DB_NAME')
};
