const controllers = require('./controllers')
const validateCpf = require('./validateCpf')

module.exports = [{
  method: 'GET',
  path: '/status',
  handler: controllers.status,
  config: {
    description: 'Status gerais do servidor',
    notes: 'Retorna informações de uptime do servidor, quantidade consultas desde o último restart e quantidade de CPFs na blacklist',
    tags: ['api', 'server']
  }
}, {
  method: 'GET',
  path: '/query',
  handler: controllers.query,
  config: {
    validate: validateCpf('query'),
    description: 'Verifica a situação do CPF',
    notes: 'Retorna FREE se o CPF não estiver na Blacklist e BLOCK caso contrário',
    tags: ['api', 'cpf']
  }
}, {
  method: 'POST',
  path: '/block',
  handler: controllers.block,
  config: {
    validate: validateCpf('payload'),
    description: 'Block CPF',
    notes: 'Blocks a CPF number if it is not in the Blacklist',
    tags: ['api', 'cpf']
  }
}, {
  method: 'POST',
  path: '/free',
  handler: controllers.free,
  config: {
    validate: validateCpf('payload'),
    description: 'Free CPF',
    notes: 'Frees a CPF number if it is in the Blacklist',
    tags: ['api', 'cpf']
  }
}]
