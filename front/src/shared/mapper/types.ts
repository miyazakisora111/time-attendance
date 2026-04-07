/** 値 S を T に変換する mapper 関数の型 */
export type Mapper<S, T> = (src: Readonly<S>) => Readonly<T>;