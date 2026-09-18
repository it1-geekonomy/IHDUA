export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '6061', 10),
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    name: process.env.DB_NAME ?? 'ihdua_db',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
  },
});
