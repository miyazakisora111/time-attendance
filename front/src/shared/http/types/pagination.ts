export interface PaginationMeta {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
}

export interface Paginated<T> {
    items: T[]
    meta: PaginationMeta
}
