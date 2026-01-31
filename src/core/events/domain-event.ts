import { UniqueEntityId } from '../entities/value-objects/unique-entity-id'

export type DomainEvent = {
  ocurredAt: Date
  getAggregateId(): UniqueEntityId
}
