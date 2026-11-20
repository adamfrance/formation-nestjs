import 'dotenv/config'; // lit .env : la CLI de TypeORM tourne en dehors de Nest, sans ConfigModule
import { DataSource } from 'typeorm';

// La connexion qu'utilise la CLI de TypeORM pour générer et lancer les migrations
export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [import.meta.dirname + '/../**/*.entity{.ts,.js}'], // toutes les entités du projet
  migrations: [import.meta.dirname + '/migrations/*{.ts,.js}'], // les migrations, rangées dans src/database/migrations
});
