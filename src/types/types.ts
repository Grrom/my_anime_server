export interface AnimeList<T> {
    [key: string]: Array<T>
}

export interface WatchedAnime {
    name: string,
    episode: string,
}

export interface ApiResponse<T> {
    data: T,
    headers: Object,
    statusCode: number
}
