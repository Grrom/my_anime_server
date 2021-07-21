
const http = require('http');

const { readdirSync, stat, createReadStream } = require('fs');
const { promisify } = require("util");
const { pipeline } = require("stream");

const fileInfo = promisify(stat);

const hostname = '127.0.0.1';
const port = 3000;

http.createServer((request: any, response: any) => {

    switch (request.url) {
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
            const sampleVideo = "./anime/somali/01.mp4";

            stat(sampleVideo, (err: any, stats: any) => {
                if (err !== null && err.code === "ENOENT") {
                    response.writeHead(404)
                }
                const fileSize = stats.size

                console.log(fileSize)
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4',
                    "Access-Control-Allow-Origin": "http://localhost:8080",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
                }

                response.writeHead(200, head);
                createReadStream(sampleVideo).pipe(response);
            })


            break;
        default:
            response.writeHead(200, { "Content-Type": "text/html" });
            response.write("not home");
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


