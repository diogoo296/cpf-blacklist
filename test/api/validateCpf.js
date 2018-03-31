const joi = require('joi')
const expect = require('chai').expect

const cpfSchema = require('../../api/validateCpf')('query').query.cpf

describe('validateCpf', function () {
  it('should invalidate CPF with length != 11', function () {
    const errorMsg = '"value" length must be 11 characters long'
    validate('2515844553', errorMsg) // 10 chars
    validate('251584455322', errorMsg) // 12 chars
  })

  it('should invalidate CPF with non-digit characters', function () {
    const errorMsg = 'CPF must have only digits'
    validate('2515844553a', errorMsg)
    validate('25158 44553', errorMsg)
  })

  it('should invalidate CPF when verification digit fails', function () {
    const errorMsg = '"value" fails verification digit validation'
    validate('25158445531', errorMsg)
    validate('01834676554', errorMsg)
  })

  it('should allow valid CPF', function () {
    validate('25158445532')
    validate('01834676550')
  })
})

const validate = (cpf, expectedErrMsg) => {
  joi.validate(cpf, cpfSchema, (err, value) => {
    if (expectedErrMsg) expect(err.message).to.be.equal(expectedErrMsg)
    else expect(err === null).to.be.equal(true)
    expect(value).to.be.equal(cpf)
  })
}
