const joi = require('joi')

const controllers = require('./controllers')

const validateCpf = {
  query: {
    cpf: joi.string().length(11).regex(/\d.*/).description('CPF number')
  }
}

module.exports = [{
  method: 'GET',
  path: '/status',
  handler: controllers.status,
  config: {
    auth: false,
    description: 'Status gerais do servidor',
    notes: 'Retorna informações de uptime do servidor, quantidade consultas desde o último restart e quantidade de CPFs na blacklist',
    tags: ['api', 'server']
  }
}, {
  method: 'GET',
  path: '/consulta',
  handler: controllers.verifyCpf,
  config: {
    auth: false,
    validate: validateCpf,
    description: 'Verifica a situação do CPF',
    notes: 'Retorna FREE se o CPF não estiver na Blacklist e BLOCK caso contrário',
    tags: ['api', 'cpf']
  }
}, {
  method: 'GET',
  path: '/blacklist',
  handler: controllers.blacklist,
  config: {
    auth: false,
    description: 'CPF Blacklist',
    notes: 'Retorna a lista de CPFs cadastrados na Blacklist',
    tags: ['api', 'cpf']
  }
}, {
  method: 'GET',
  path: '/valid',
  handler: controllers.valid,
  config: {
    auth: false,
    validate: validateCpf,
    description: 'Número de CPF válido?',
    notes: 'Retorna VERDADEIRO caso o número de CPF seja válido e FALSO caso contrário',
    tags: ['api', 'cpf']
  }
}]
