import { statSync } from "fs";

const http = require('http');
const url = require('url');

const { readdirSync, stat, createReadStream } = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

http.createServer((request: any, response: any) => {

    switch (url.parse(request.url, true).pathname) {
        case "/anime-list":
            response.writeHead(200, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:8080",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
            });
            response.write(animeList());
            response.end();
            break;
        case "/video":
            const query = url.parse(request.url, true).query;
            const requestVideo = `./anime/${query.anime}/${query.episode}`;
            const videoSize = statSync(requestVideo).size;

            const range = request.headers.range;
            if (range) {
                const CHUNK_SIZE = 10 ** 6;
                const start = Number(range.replace(/\D/g, ""));
                const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

                response.writeHead(206, {
                    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                    "Accept-Ranges": "bytes",
                    "Content-Length": end - start + 1,
                    "Content-Type": "video/mp4",
                    "Access-Control-Allow-Origin": "http://localhost:8080",
                    "Access-Control-Allow-Headers": "Range",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
                });

                createReadStream(requestVideo, { start, end }).pipe(response)

            } else {
                stat(requestVideo, (err: any, stats: any) => {
                    if (err !== null && err.code === "ENOENT") {
                        response.writeHead(404)
                    }
                    const fileSize = stats.size

                    response.writeHead(206, {
                        'Content-Length': fileSize,
                        'Content-Type': 'video/mp4',
                        "Accept-Ranges": "bytes",
                        "Access-Control-Allow-Headers": "Range",
                        "Access-Control-Allow-Origin": "http://localhost:8080",
                        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
                    });

                    createReadStream(requestVideo).pipe(response);
                })
            }

            break;
        default:
            response.writeHead(
                200, {
                "Access-Control-Allow-Origin": "http://localhost:8080",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
            });
            console.log(url.parse(request.url, true).pathname)
            response.write(JSON.stringify("hello"))
            response.end()
    }
}).listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

const animeList = (): string => {
    let animes: { [k: string]: string } = {};
    readdirSync("./anime").forEach((animeName: string) => {
        if (animeName !== ".keep")
            animes[animeName] = readdirSync(`./anime/${animeName}`);
    });
    return JSON.stringify(animes);
}


