import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Comment, CommentProps } from './comment'
import { CommentOnQuestionEvent } from './events/comment-on-question-event'

export type QuestionCommentProps = {
  questionId: UniqueEntityId
} & CommentProps

export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId
  }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityId
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    const isNewQuestionComment = !id
    if (isNewQuestionComment) {
      questionComment.addDomainEvent(
        new CommentOnQuestionEvent(questionComment)
      )
    }

    return questionComment
  }
}
