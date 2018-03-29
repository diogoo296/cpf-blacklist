module.exports = {
  plugin: require('hapi-swagger'),
  options: {
    info: {
      title: 'CPF Blacklist',
      description:
        'A simple project to blacklist CPF numbers using a REST API',
      version: require('../package').version
    },
    schemes: ['http'],
    sortTags: 'name',
    auth: false
  }
}
