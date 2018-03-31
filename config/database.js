const join = require('path').join

const config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: 'cpf_dev',
    host: '127.0.0.1',
    dialect: 'sqlite',
    storage: join(__dirname, '../data/cpf_dev.sqlite')
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: 'cpf_test',
    host: '127.0.0.1',
    dialect: 'sqlite',
    storage: join(__dirname, '../data/cpf_test.sqlite')
  }
}

module.exports = config[process.env.NODE_ENV || 'development']
