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
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID ?? '',
    keySecret: process.env.RAZORPAY_KEY_SECRET ?? '',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'ihdua-dev-jwt-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
  admin: {
    email: process.env.ADMIN_EMAIL ?? 'admin@ihdua.org',
    password: process.env.ADMIN_PASSWORD ?? 'Admin@123',
    fullName: process.env.ADMIN_FULL_NAME ?? 'IHDUA Admin',
  },
});
