const config = {
  test: {
    host: 'localhost',
    database: 'cpf_app_test',
    storage: './cpf_app_test.sqlite'
  },
  development: {
    host: 'localhost',
    database: 'cpf_app',
    storage: './cpf_app.sqlite'
  }
}

module.exports = config[process.env.NODE_ENV || 'development']
