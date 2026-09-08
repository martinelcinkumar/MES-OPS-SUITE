import 'dotenv/config';
import { DataSource } from 'typeorm';
import { buildDataSourceOptions } from '../config/typeorm-options';

/**
 * Entry point used by the TypeORM CLI only (migration:generate / migration:run).
 * The running app gets its connection via DatabaseModule instead.
 */
export default new DataSource(buildDataSourceOptions(process.env));
