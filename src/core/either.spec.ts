import { Either, left, right } from './either'

function doSomenthing(x: boolean): Either<string, number> {
  if (x) {
    return right(42)
  } else {
    return left('It failed!')
  }
}

test('Success result', () => {
  const result = doSomenthing(true)

  expect(result.isRight()).toEqual(true)
  expect(result.isLeft()).toEqual(false)
})

test('Error result', () => {
  const result = doSomenthing(false)
  expect(result.isLeft()).toEqual(true)
  expect(result.isRight()).toEqual(false)
})
