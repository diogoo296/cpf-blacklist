const Joi = require('joi')

const CPF_LEN = 11

module.exports = (key) => ({
  [key]: {
    cpf: customJoi.string().cpf().required()
  }
})

const formatErrors = (errors) => errors.map(err => {
  if (err.type === 'string.regex.base') err.message = 'CPF must have only digits'
  return err
})

const customJoi = Joi.extend((joi) => ({
  base: joi
    .string()
    .length(CPF_LEN) // CPF must have 11 caracters
    .regex(/^\d+$/) // CPF must have only digits
    .description('CPF number')
    .error(formatErrors),

  name: 'string',

  language: { cpf: 'fails verification digit validation' },

  rules: [{
    name: 'cpf',

    validate (params, value, state, options) {
      console.log(value)
      return cpfIsValid(value)
        ? value
        : this.createError('string.cpf', { v: value }, state, options)
    }
  }]
}))

const cpfIsValid = (cpfStr) => {
  // Transform CPF string to an integer array
  const cpfArr = cpfStr.split('').map(Number)
  const lastDigit = cpfArr[cpfArr.length - 1]
  let multiplier = CPF_LEN

  // Calculate CPF sum to check with last digit
  const sum = cpfArr
    .slice(0, -1)
    .reduce(
      (acc, cur) => {
        acc += cur * multiplier
        multiplier--
        return acc
      },
      0
    )

  const reminder = sum % 11

  if ([0, 1].includes(reminder)) return lastDigit === 0
  else return lastDigit === CPF_LEN - reminder
}
