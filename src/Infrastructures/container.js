/* istanbul ignore file */

const { createContainer } = require('instances-container')

// external agency
const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')
const Jwt = require('@hapi/jwt')
const pool = require('./database/postgres/pool')

// service (repository, helper, manager, etc)
const UserRepository = require('../Domains/users/UserRepository')
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres')
const PasswordHash = require('../Applications/security/PasswordHash')
const BcryptPasswordHash = require('./security/BcryptPasswordHash')
const ThreadRepository = require('../Domains/threads/ThreadRepository')
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres')
const CommentRepository = require('../Domains/comments/CommentRepository')
const CommentRepositoryPostgres = require('../Infrastructures/repository/CommentRepositoryPostgres')
const ReplyRepository = require('../Domains/replies/ReplyRepository')
const ReplyRepositoryPostgres = require('../Infrastructures/repository/ReplyRepositoryPostgres')
const LikeRepository = require('../Domains/likes/LikeRepository')
const LikeRepositoryPostgres = require('../Infrastructures/repository/LikeRepositoryPostgres')

// use case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase')
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager')
const JwtTokenManager = require('./security/JwtTokenManager')
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase')
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository')
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres')
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase')
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase')
const AddThreadUseCase = require('../Applications/use_case/AddThreadUseCase')
const AddCommentUseCase = require('../Applications/use_case/AddCommentUseCase')
const DeleteCommentUseCase = require('../Applications/use_case/DeleteCommentUseCase')
const GetDetailThreadUseCase = require('../Applications/use_case/GetDetailThreadUseCase')
const AddReplyUseCase = require('../Applications/use_case/AddReplyUseCase')
const DeleteReplyUseCase = require('../Applications/use_case/DeleteReplyUseCase')
const LikeCommentUseCase = require('../Applications/use_case/LikeCommentUseCase')

// creating container
const container = createContainer()

// reuse parameter
const generalRepositoryParameter = {
  dependencies: [
    {
      concrete: pool
    },
    {
      concrete: nanoid
    }
  ]
}

const useCaseParameter = {
  injectType: 'destructuring',
  dependencies: [
    {
      name: 'userRepository',
      internal: UserRepository.name
    },
    {
      name: 'authenticationRepository',
      internal: AuthenticationRepository.name
    },
    {
      name: 'authenticationTokenManager',
      internal: AuthenticationTokenManager.name
    },
    {
      name: 'passwordHash',
      internal: PasswordHash.name
    },
    {
      name: 'threadRepository',
      internal: ThreadRepository.name
    },
    {
      name: 'commentRepository',
      internal: CommentRepository.name
    },
    {
      name: 'replyRepository',
      internal: ReplyRepository.name
    },
    {
      name: 'likeRepository',
      internal: LikeRepository.name
    }
  ]
}

// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: generalRepositoryParameter
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        }
      ]
    }
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt
        }
      ]
    }
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token
        }
      ]
    }
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: generalRepositoryParameter
  },
  {
    key: CommentRepository.name,
    Class: CommentRepositoryPostgres,
    parameter: generalRepositoryParameter
  },
  {
    key: ReplyRepository.name,
    Class: ReplyRepositoryPostgres,
    parameter: generalRepositoryParameter
  },
  {
    key: LikeRepository.name,
    Class: LikeRepositoryPostgres,
    parameter: generalRepositoryParameter
  }
])

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: useCaseParameter
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: useCaseParameter
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: useCaseParameter
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: useCaseParameter
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: useCaseParameter
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: useCaseParameter
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: useCaseParameter
  },
  {
    key: GetDetailThreadUseCase.name,
    Class: GetDetailThreadUseCase,
    parameter: useCaseParameter
  },
  {
    key: AddReplyUseCase.name,
    Class: AddReplyUseCase,
    parameter: useCaseParameter
  },
  {
    key: DeleteReplyUseCase.name,
    Class: DeleteReplyUseCase,
    parameter: useCaseParameter
  },
  {
    key: LikeCommentUseCase.name,
    Class: LikeCommentUseCase,
    parameter: useCaseParameter
  }
])

module.exports = container
