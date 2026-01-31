import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notification'
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryRepository)
  })

  it('should be able to read a notification', async () => {
    const newNotification = makeNotification()

    inMemoryRepository.create(newNotification)

    const result = await sut.execute({
      recipientId: newNotification.recipientId.toString(),
      notificationId: newNotification.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRepository.items[0].readAt).toEqual(expect.any(Date))
  })

  it('should not be able to read a notification from another recipient', async () => {
    const newNotification = makeNotification({
      recipientId: new UniqueEntityId('recip-1'),
    })

    await inMemoryRepository.create(newNotification)

    const result = await sut.execute({
      recipientId: 'recip-2',
      notificationId: newNotification.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
