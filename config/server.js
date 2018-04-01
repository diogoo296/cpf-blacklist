const config = {
  development: {
    host: '0.0.0.0', // Use this instead of localhost
    port: 3000
  },
  test: {
    host: '0.0.0.0', // Use this instead of localhost
    port: 3000
  }
}

module.exports = config[process.env.NODE_ENV || 'development']
