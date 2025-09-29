import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { registerRoutes } from './routes';
import { notFoundHandler } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

app.use('/api', registerRoutes());

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
