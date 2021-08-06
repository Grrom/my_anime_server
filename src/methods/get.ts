import { createReadStream, readdirSync, readFileSync, ReadStream, statSync } from "fs";
import { AnimeList, ApiResponse } from "../types/types";

export function animeList(): ApiResponse<String> {
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:8080",
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
        return { statusCode: 200, headers: headers, data: createReadStream(requestVideo) };
    };
}

export function MyAnimeClient(): ApiResponse<string> {
    const headers = {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "http://localhost:8080",
        "Access-Control-Allow-Methods": "GET",
    }

    let page = readFileSync("./src/client/index.html", "utf8");

    return { statusCode: 200, headers: headers, data: page };
}

export function getAsset(extension: string): ApiResponse<string> {
    console.log("getting asset")

    let contentType;
    switch (extension) {
        case "ttf":
            contentType = "application/octet-stream"
            break;
        case "js":
            contentType = "application/javascript"
            break
    }

    const headers = {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "http://localhost:8080",
        "Access-Control-Allow-Methods": "GET",
    }

    let assetRequested = readdirSync("./src/client", "utf-8").filter(file => file.match(new RegExp(`.*\.${extension}`, 'ig')))[0]

    assetRequested = readFileSync(`./src/client/${assetRequested}`, "utf-8")

    return { statusCode: 200, headers: headers, data: assetRequested };
}