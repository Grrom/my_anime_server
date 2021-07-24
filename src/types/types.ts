export interface AnimeList {
    [key: string]: Array<String>
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
