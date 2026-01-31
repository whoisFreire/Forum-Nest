import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import z from 'zod'
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials-error'

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string(),
})

type AuthenticateBody = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@UsePipes(new ZodValidationPipe(authenticateBodySchema))
export class AuthenticateController {
  constructor(private readonly authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @HttpCode(200)
  async handle(@Body() body: AuthenticateBody) {
    const result = await this.authenticateStudent.execute(body)

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return { access_token: accessToken }
  }
}
