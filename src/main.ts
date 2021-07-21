
const http = require('http');
const url = require('url');

const { readdirSync, stat, createReadStream } = require('fs');
const { promisify } = require("util");
const { pipeline } = require("stream");

const fileInfo = promisify(stat);

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

            stat(requestVideo, (err: any, stats: any) => {
                if (err !== null && err.code === "ENOENT") {
                    response.writeHead(404)
                }
                const fileSize = stats.size

                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4',
                    "Access-Control-Allow-Origin": "http://localhost:8080",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
                }
                response.writeHead(200, head);
                createReadStream(requestVideo).pipe(response);
            })
            break;
        case "/testing":
            console.log(url.parse(request.url, true).query)
            response.writeHead(
                200, {
                "Access-Control-Allow-Origin": "http://localhost:8080",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
            });
            response.write(JSON.stringify(url.parse(request.url, true).query))
            response.end()
            break
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


