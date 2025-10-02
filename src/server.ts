import { app } from './app';
import { env } from './config/env';

const { port } = env;

app.listen(port, () => {
    console.log(`API Taller Mecánico en http://140.84.169.148:${port}`);
    console.log(`Modo: ${env.nodeEnv}`);
    console.log(`Base de datos: ${env.dbName}`);
    console.log(`Host: ${env.dbHost}`);
    console.log(`Usuario: ${env.dbUser}`);
    console.log(`Puerto de la base de datos: ${env.dbPort}`);
});
