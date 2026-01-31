import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    )
    sut = new FetchQuestionAnswersUseCase(inMemoryRepository)
  })

  it('should be able to fetch question answers', async () => {
    await inMemoryRepository.create(
      makeAnswer({
        questionId: new UniqueEntityId('question-1'),
      })
    )

    await inMemoryRepository.create(
      makeAnswer({
        questionId: new UniqueEntityId('question-1'),
      })
    )

    await inMemoryRepository.create(
      makeAnswer({
        questionId: new UniqueEntityId('question-1'),
      })
    )

    const result = await sut.execute({ questionId: 'question-1', page: 1 })

    expect(result.value?.answers).toHaveLength(3)
  })

  it('should be able to fetch paginated question answers', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryRepository.create(
        makeAnswer({
          questionId: new UniqueEntityId('question-1'),
        })
      )
    }

    const result = await sut.execute({ questionId: 'question-1', page: 2 })
    expect(result.value?.answers).toHaveLength(2)
  })
})
