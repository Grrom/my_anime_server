import { createReadStream, readdirSync, ReadStream, statSync } from "fs";
import { AnimeList, ApiResponse } from "../types/types";

export function animeList(): ApiResponse<String> {
    let animes: AnimeList = {};
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:8080",
        "Access-Control-Allow-Methods": "GET",
    }
    readdirSync("./anime").forEach((animeName: string) => {
        if (animeName !== ".keep")
            animes[animeName] = readdirSync(`./anime/${animeName}`);
    });
    return { data: JSON.stringify(animes), headers: headers, statusCode: 200 };

}

export function video(requestUrl: URL, requestHeaders: any): ApiResponse<ReadStream> {

    const searchParams = requestUrl.searchParams;
    const requestVideo = `./anime/${searchParams.get("anime")}/${searchParams.get("episode")}`;
    const videoSize = statSync(requestVideo).size;
    const range = requestHeaders.range;

    if (range) {
        const CHUNK_SIZE = 10 ** 6;
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": end - start + 1,
            "Content-Type": "video/mp4",
            "Access-Control-Allow-Origin": "http://localhost:8080",
            "Access-Control-Allow-Headers": "Range",
            "Access-Control-Allow-Methods": "GET",
        };
        return { data: createReadStream(requestVideo, { start, end }), headers: headers, statusCode: 206 };
    } else {
        const headers = {
            'Content-Length': video,
            'Content-Type': 'video/mp4',
            "Accept-Ranges": "bytes",
            "Access-Control-Allow-Headers": "Range",
            "Access-Control-Allow-Origin": "http://localhost:8080",
            "Access-Control-Allow-Methods": "GET",
        };
        return { data: createReadStream(requestVideo), headers: headers, statusCode: 200 };
    };
}