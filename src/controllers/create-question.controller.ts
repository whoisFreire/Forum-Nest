import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import z from 'zod'
import { PrismaService } from '../prisma/prisma.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'
import type { UserPayload } from '../auth/jwt.strategy'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

const validator = new ZodValidationPipe(createQuestionBodySchema)

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
@UsePipes()
export class CreateQuestionController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  async handle(@CurrentUser() user: UserPayload, @Body(validator) body: CreateQuestionBody) {
    const { title, content } = body
    const { sub: userId } = user

    const slug = this.convertToSlug(title)
    await this.prismaService.question.create({
      data: {
        title,
        content,
        slug,
        authorId: userId
      }
    })
  }

  private convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  }
}
