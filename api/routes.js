const joi = require('joi')

const controllers = require('./controllers')

const validateCpf = {
  query: {
    cpf: joi
      .string()
      .length(11)
      .regex(/^\d+$/)
      .required()
      .description('CPF number')
  }
}

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
  path: '/consulta',
  handler: controllers.verifyCpf,
  config: {
    validate: validateCpf,
    description: 'Verifica a situação do CPF',
    notes: 'Retorna FREE se o CPF não estiver na Blacklist e BLOCK caso contrário',
    tags: ['api', 'cpf']
  }
}, {
  method: 'GET',
  path: '/block',
  handler: controllers.block,
  config: {
    validate: validateCpf,
    description: 'Block CPF',
    notes: 'Blocks a CPF number if it is not in the Blacklist',
    tags: ['api', 'cpf']
  }
}, {
  method: 'GET',
  path: '/free',
  handler: controllers.free,
  config: {
    validate: validateCpf,
    description: 'Free CPF',
    notes: 'Frees a CPF number if it is in the Blacklist',
    tags: ['api', 'cpf']
  }
}, {
  method: 'GET',
  path: '/valid',
  handler: controllers.cpfIsValid,
  config: {
    validate: validateCpf,
    description: 'Número de CPF válido?',
    notes: 'Retorna VERDADEIRO caso o número de CPF seja válido e FALSO caso contrário',
    tags: ['api', 'cpf']
  }
}]
