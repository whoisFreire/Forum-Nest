import { Controller, HttpCode, Post } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Controller('/sessions')
export class AuthenticateController {
  constructor(private readonly jwtService: JwtService) {}

  @Post()
  @HttpCode(200)
  async handle() {
    const token = this.jwtService.sign({ sub: 'user-id' })

    return token
  }
}
