import { registerAs } from '@nestjs/config';

/**
 * DB_DRIVER=sqlite is the local/dev fallback used when no SQL Server instance
 * is reachable (e.g. this sandbox has no Docker daemon). DB_DRIVER=mssql is
 * what points at the real corporate SQL Server at deploy time. Entities are
 * written to be portable across both (no driver-specific column types).
 */
export default registerAs('database', () => ({
  driver: process.env.DB_DRIVER || 'sqlite',
  sqlitePath: process.env.DB_SQLITE_PATH || 'data/dev.sqlite',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  username: process.env.DB_USERNAME || 'sa',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mes_ops_suite',
  encrypt: process.env.DB_ENCRYPT !== 'false',
  trustServerCertificate: process.env.DB_TRUST_SERVER_CERT === 'true',
}));
