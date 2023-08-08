const InvariantError = require('./InvariantError')

const DomainErrorTranslator = {
  translate (error) {
    return DomainErrorTranslator._directories[error.message] || error
  }
}

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_PROPERTY_CORRECTLY': new InvariantError(
    'Gagal membuat user karena properti tidak lengkap'
  ),
  'REGISTER_USER.WRONG_DATA_TYPE': new InvariantError(
    'Gagal membuat user karena tipe data masih salah'
  ),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError(
    'tidak dapat membuat user baru karena karakter username melebihi batas limit'
  ),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError(
    'tidak dapat membuat user baru karena username mengandung karakter terlarang'
  ),
  'USER_LOGIN.NOT_CONTAIN_PROPERTY_CORRECTLY': new InvariantError(
    'harus mengirimkan username dan password'
  ),
  'USER_LOGIN.WRONG_DATA_TYPE': new InvariantError(
    'username dan password harus string'
  ),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_WRONG_DATA_TYPE': new InvariantError(
    'refresh token harus string'
  ),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_WRONG_DATA_TYPE': new InvariantError(
    'refresh token harus string'
  ),
  'NEW_THREAD.NOT_CONTAIN_PROPERTY_CORRECTLY': new InvariantError(
    'Gagal membuat thread karena properti tidak lengkap'
  ),
  'NEW_THREAD.WRONG_DATA_TYPE': new InvariantError(
    'Gagal membuat thread karena tipe data masih salah'
  ),
  'NEW_COMMENT.NOT_CONTAIN_PROPERTY_CORRECTLY': new InvariantError(
    'Gagal membuat comment karena properti tidak lengkap'
  ),
  'NEW_COMMENT.WRONG_DATA_TYPE': new InvariantError(
    'Gagal membuat comment karena tipe data masih salah'
  ),
  'NEW_REPLY.NOT_CONTAIN_PROPERTY_CORRECTLY': new InvariantError(
    'Gagal membuat reply karena properti tidak lengkap'
  ),
  'NEW_REPLY.WRONG_DATA_TYPE': new InvariantError(
    'Gagal membuat reply karena tipe data masih salah'
  )
}

module.exports = DomainErrorTranslator
