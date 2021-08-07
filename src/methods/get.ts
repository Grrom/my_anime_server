import { createReadStream, readdirSync, readFileSync, ReadStream, statSync } from "fs";
import { allowedOrigin } from "../helper";
import { AnimeList, ApiResponse } from "../types/types";

export function animeList(origin: string): ApiResponse<String> {
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": allowedOrigin(origin),
        "Access-Control-Allow-Methods": "GET",
    }

    let watchedAnimes: AnimeList<{ episode: string, timeStamp: number }> = {};
    try {
        watchedAnimes = JSON.parse(readFileSync("./watched.json", "utf8"));
    } catch (error) {
        if (error.code === "ENOENT")
            console.log("File Doesn't exist")
    }

    let animes: AnimeList<string> = {};
    readdirSync("./anime").forEach((animeName: string) => {
        if (animeName !== ".keep") {
            animes[animeName] = readdirSync(`./anime/${animeName}`);
        }
    });

    let animeList: AnimeList<{ episode: String, watched: Boolean, timeStamp: number }> = {};
    Object.keys(animes).forEach((animeName) => {
        animeList[animeName] = [];
        animes[animeName].forEach((episode: string) => {
            let selectedIndex = watchedAnimes[animeName] !== undefined ? watchedAnimes[animeName].map(anime => anime.episode).indexOf(episode) : -1
            animeList[animeName].push({
                episode: episode,
                watched: selectedIndex >= 0,
                timeStamp: selectedIndex >= 0 ? watchedAnimes[animeName][selectedIndex].timeStamp : 0
            })
        })
    })

    return { statusCode: 200, headers: headers, data: JSON.stringify(animeList) };
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
            "Access-Control-Allow-Origin": allowedOrigin(requestHeaders.origin),
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
            "Access-Control-Allow-Origin": allowedOrigin(requestHeaders.origin),
            "Access-Control-Allow-Methods": "GET",
        };
        return { statusCode: 200, headers: headers, data: createReadStream(requestVideo) };
    };
}

export function MyAnimeClient(origin: string): ApiResponse<string> {
    const headers = {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": allowedOrigin(origin),
        "Access-Control-Allow-Methods": "GET",
    }

    let page = readFileSync("./client/index.html", "utf8");

    return { statusCode: 200, headers: headers, data: page };
}

export function getAsset(assetRequested: string, extension: string, origin: string): ApiResponse<string> {

    let contentType;
    let encoding: BufferEncoding = "utf-8";
    switch (extension) {
        case "ttf":
            contentType = "application/octet-stream"
            encoding = "utf-8"
            // i'm not actually serving my fonts anymore im just linking to google fonts but
            // I'll keep this piece of code here just in-case I need to host other files other than the javascript file
            break;
        case "js":
            contentType = "application/javascript"
            encoding = "utf-8"
            break
    }

    const headers = {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": allowedOrigin(origin),
        "Access-Control-Allow-Methods": "GET",
    }

    assetRequested = readFileSync(`./client${assetRequested}`, encoding)

    return { statusCode: 200, headers: headers, data: assetRequested };
}