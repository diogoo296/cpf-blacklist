const controllers = require('./controllers')
const validateCpf = require('./validateCpf')

module.exports = [{
  method: 'GET',
  path: '/status',
  handler: controllers.status,
  config: {
    description: 'General server status',
    notes: 'Return server uptime info, requests count and the CPF Blacklist',
    tags: ['api', 'server']
  }
}, {
  method: 'GET',
  path: '/query',
  handler: controllers.query,
  config: {
    validate: validateCpf('query'),
    description: 'Query CPF situation',
    notes: 'Return FREE if the CPF is in the Blacklist and BLOCKED if not',
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
