import { DataSourceOptions } from 'typeorm';

/**
 * Shared driver-selection logic used by both the NestJS runtime
 * (TypeOrmModule.forRootAsync in database.module.ts) and the TypeORM CLI
 * (data-source.ts, for generating/running migrations). Keeping this in one
 * place means `npm run migration:generate` sees exactly the same connection
 * the app would use.
 */
export function buildDataSourceOptions(env: NodeJS.ProcessEnv): DataSourceOptions {
  const driver = env.DB_DRIVER || 'sqlite';

  if (driver === 'mssql') {
    return {
      type: 'mssql',
      host: env.DB_HOST || 'localhost',
      port: parseInt(env.DB_PORT || '1433', 10),
      username: env.DB_USERNAME || 'sa',
      password: env.DB_PASSWORD || '',
      database: env.DB_NAME || 'mes_ops_suite',
      options: {
        encrypt: env.DB_ENCRYPT !== 'false',
        trustServerCertificate: env.DB_TRUST_SERVER_CERT === 'true',
      },
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
      synchronize: false,
    };
  }

  return {
    type: 'better-sqlite3',
    database: env.DB_SQLITE_PATH || 'data/dev.sqlite',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    synchronize: false,
  };
}
