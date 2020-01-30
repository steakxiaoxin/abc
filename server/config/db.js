const env = process.env.NODE_ENV

const MYSQL_CONF = {
  dev: {
    host: 'localhost',
    user: 'root',
    password: '12345678',
    port: '3306',
    database: 'myblog',
  },
  production: {
    host: '47.102.132.207',
    user: 'root',
    password: '12345678',
    port: '3306',
    database: 'bixin',
  },
}[env]

const REDIS_CONF = {
  dev: {
    port: 6379,
    host: '127.0.0.1',
  },
  production: {
    port: 6379,
    host: '127.0.0.1',
  },
}[env]

module.exports = {
  MYSQL_CONF,
  REDIS_CONF,
}
