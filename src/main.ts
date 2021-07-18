const http = require('http');
const path = require('path');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

http.createServer((request: any, response: any) => {

    switch (request.url) {
        case "/anime-list":
            console.log(request);
            response.writeHead(200, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:8080",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
            });
            response.write(animeList());
            break;
        default:
            response.writeHead(200, { "Content-Type": "text/html" });
            response.write("not home");
    }
    response.end();
}).listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

const animeList = (): string => {
    let animes: { [k: string]: string } = {};
    fs.readdirSync("./anime").forEach((animeName: string) => {
        if (animeName !== ".keep")
            animes[animeName] = fs.readdirSync(`./anime/${animeName}`);
    });
    return JSON.stringify(animes);
}


