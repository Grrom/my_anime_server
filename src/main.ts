const http = require('http');
const path = require('path');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

http.createServer((request: any, response: any) => {
    console.log("got a request");
    switch (request.url) {
        case "/":
            response.writeHead(200, { "Content-Type": "application/json" });
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


