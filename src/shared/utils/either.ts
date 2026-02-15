export type Left<E> = { readonly _tag: 'Left'; readonly value: E }
export type Right<A> = { readonly _tag: 'Right'; readonly value: A }
export type Either<E, A> = Left<E> | Right<A>

export const left = <E>(value: E): Left<E> => ({ _tag: 'Left', value })
export const right = <A>(value: A): Right<A> => ({ _tag: 'Right', value })

export const isLeft = <E, A>(either: Either<E, A>): either is Left<E> =>
  either._tag === 'Left'

export const isRight = <E, A>(either: Either<E, A>): either is Right<A> =>
  either._tag === 'Right'

export const fold = <E, A, B>(
  either: Either<E, A>,
  onLeft: (e: E) => B,
  onRight: (a: A) => B
): B => (isLeft(either) ? onLeft(either.value) : onRight(either.value))

export const map = <E, A, B>(
  either: Either<E, A>,
  f: (a: A) => B
): Either<E, B> => (isRight(either) ? right(f(either.value)) : either)

export const flatMap = <E, A, B>(
  either: Either<E, A>,
  f: (a: A) => Either<E, B>
): Either<E, B> => (isRight(either) ? f(either.value) : either)
