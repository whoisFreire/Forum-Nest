import { BadRequestException, PipeTransform } from '@nestjs/common'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: z.ZodType) {}

  async transform(value: unknown) {
    try {
      this.schema.parse(value)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          error: fromZodError(error).details.map(err => {
            return {
              path: err.path.toString(),
              message: err.message,
            }
          }),
        })
      }
      throw new BadRequestException('Validation failed')
    }
    return value
  }
}
