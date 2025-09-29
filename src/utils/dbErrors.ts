import { HttpError } from './httpError';

type MySqlError = Error & { code?: string };

export const handleDbError = (error: unknown, fallbackMessage: string): never => {
    const err = error as MySqlError;

    if (err?.code === 'ER_DUP_ENTRY') {
        throw new HttpError(409, 'Registro duplicado', err.message);
    }

    if (err?.code === 'ER_ROW_IS_REFERENCED_2' || err?.code === 'ER_ROW_IS_REFERENCED') {
        throw new HttpError(409, 'Existen registros relacionados que impiden la operación', err.message);
    }

    console.error('[DB_ERROR]', err);
    throw new HttpError(500, fallbackMessage, err.message);
};
