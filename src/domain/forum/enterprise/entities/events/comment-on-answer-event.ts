import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { AnswerComment } from '../answer-comment'

export class CommentOnAnswerEvent implements DomainEvent {
  public ocurredAt: Date
  public answerComment: AnswerComment

  constructor(answerComment: AnswerComment) {
    this.answerComment = answerComment
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityId {
    return this.answerComment.id
  }
}
