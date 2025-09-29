import { app } from './app';
import { env } from './config/env';

const { port } = env;

app.listen(port, () => {
    console.log(`🚗 API Taller Mecánico escuchando en http://localhost:${port}`);
});
