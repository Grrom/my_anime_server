export interface AnimeList {
    [key: string]: Array<String>
}

export interface ApiResponse<T> {
    data: T,
    headers: Object,
    statusCode: number
}