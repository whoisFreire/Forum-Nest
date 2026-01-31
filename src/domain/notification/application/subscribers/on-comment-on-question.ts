import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { CommentOnQuestionEvent } from '@/domain/forum/enterprise/entities/events/comment-on-question-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnCommentOnQuestion implements EventHandler {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendCommentOnQuestionNotification.bind(this),
      CommentOnQuestionEvent.name
    )
  }

  private async sendCommentOnQuestionNotification({
    questionComment,
  }: CommentOnQuestionEvent) {
    const question = await this.questionsRepository.findById(
      questionComment.questionId.toString()
    )

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Novo comentário na sua pergunta em ${question.title.substring(0, 40).concat('...')}`,
        content: questionComment.content.substring(0, 200).concat('...'),
      })
    }
  }
}
