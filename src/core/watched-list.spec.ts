import { WatchedList } from './watched-list'

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b
  }
}

describe('WatchedList', () => {
  it('should be able to create a WatchedList with initial items', () => {
    const watchedList = new NumberWatchedList([ 1, 2, 3 ])

    expect(watchedList.currentItems).toHaveLength(3)
  })

  it('should be able to add new items to WatchedList', () => {
    const watchedList = new NumberWatchedList([ 1, 2, 3 ])

    watchedList.add(4)
    expect(watchedList.currentItems).toHaveLength(4)
    expect(watchedList.getNewItems()).toEqual([ 4 ])
  })

  it('should be able to remove items from WatchedList', () => {
    const watchedList = new NumberWatchedList([ 1, 2, 3 ])

    watchedList.remove(2)
    expect(watchedList.currentItems).toHaveLength(2)
    expect(watchedList.getRemovedItems()).toEqual([ 2 ])
  })

  it('should be able to add an item even if it was removed before from WatchedList', () => {
    const watchedList = new NumberWatchedList([ 1, 2, 3 ])

    watchedList.remove(2)
    watchedList.add(2)

    expect(watchedList.currentItems).toHaveLength(3)
    expect(watchedList.getRemovedItems()).toEqual([])
    expect(watchedList.getNewItems()).toEqual([])
  })

  it('should be able to remove an item even if it was add before from WatchedList', () => {
    const watchedList = new NumberWatchedList([ 1, 2, 3 ])

    watchedList.add(4)
    watchedList.remove(4)

    expect(watchedList.currentItems).toHaveLength(3)
    expect(watchedList.getRemovedItems()).toEqual([])
    expect(watchedList.getNewItems()).toEqual([])
  })

  it('should be able to update WatchedList items', () => {
    const watchedList = new NumberWatchedList([ 1, 2, 3 ])

    watchedList.update([ 1, 3, 5 ])

    expect(watchedList.getRemovedItems()).toEqual([ 2 ])
    expect(watchedList.getNewItems()).toEqual([ 5 ])
  })
})
