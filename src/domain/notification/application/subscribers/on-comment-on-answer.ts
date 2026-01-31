import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { CommentOnAnswerEvent } from '@/domain/forum/enterprise/entities/events/comment-on-answer-event'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'

export class OnCommentOnAnswer implements EventHandler {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly questionsRepository: QuestionsRepository,
    private readonly sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendCommentOnAnswerNotification.bind(this),
      CommentOnAnswerEvent.name
    )
  }

  private async sendCommentOnAnswerNotification({
    answerComment,
  }: CommentOnAnswerEvent) {
    const answer = await this.answersRepository.findById(
      answerComment.answerId.toString()
    )

    if (answer) {
      const question = await this.questionsRepository.findById(
        answer.questionId.toString()
      )
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Novo comentário na sua resposta em ${question?.title.substring(0, 40).concat('...')}`,
        content: answerComment.content.substring(0, 200).concat('...'),
      })
    }
  }
}
