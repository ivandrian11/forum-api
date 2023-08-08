const DomainErrorTranslator = require('../DomainErrorTranslator')
const InvariantError = require('../InvariantError')

describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.NOT_CONTAIN_PROPERTY_CORRECTLY')
      )
    ).toStrictEqual(
      new InvariantError('Gagal membuat user karena properti tidak lengkap')
    )

    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.WRONG_DATA_TYPE')
      )
    ).toStrictEqual(
      new InvariantError('Gagal membuat user karena tipe data masih salah')
    )

    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat user baru karena karakter username melebihi batas limit'
      )
    )

    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat user baru karena username mengandung karakter terlarang'
      )
    )

    expect(
      DomainErrorTranslator.translate(
        new Error('NEW_THREAD.NOT_CONTAIN_PROPERTY_CORRECTLY')
      )
    ).toStrictEqual(
      new InvariantError('Gagal membuat thread karena properti tidak lengkap')
    )

    expect(
      DomainErrorTranslator.translate(new Error('NEW_THREAD.WRONG_DATA_TYPE'))
    ).toStrictEqual(
      new InvariantError('Gagal membuat thread karena tipe data masih salah')
    )

    expect(
      DomainErrorTranslator.translate(
        new Error('NEW_REPLY.NOT_CONTAIN_PROPERTY_CORRECTLY')
      )
    ).toStrictEqual(
      new InvariantError('Gagal membuat reply karena properti tidak lengkap')
    )

    expect(
      DomainErrorTranslator.translate(new Error('NEW_REPLY.WRONG_DATA_TYPE'))
    ).toStrictEqual(
      new InvariantError('Gagal membuat reply karena tipe data masih salah')
    )
  })

  it('should return original error when error message is not needed to translate', () => {
    // Arrange
    const error = new Error('some_error_message')

    // Action
    const translatedError = DomainErrorTranslator.translate(error)

    // Assert
    expect(translatedError).toStrictEqual(error)
  })
})
