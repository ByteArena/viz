
type DequeItem = any;

interface Deque {

    push: (...items: DequeItem[]) => number
    unshift: (DequeItem) => number

    pop: () => DequeItem | undefined

    shift: () => DequeItem | undefined;

    toArray: () => DequeItem[]

    peekBack: () => DequeItem | undefined

    peekFront: () => DequeItem | undefined

    peekAt: (index: number) => DequeItem | undefined

    isEmpty: () => boolean

    clear: () => void

    size: () => number

}