import { expect, test } from 'vitest'
import { Slug } from './slug'

test('it should ble able to create a slug from text', () => {
  const slug = Slug.createFromTitle('Example Title for_ slug')

  expect(slug.value).toEqual('example-title-for-slug')
})
