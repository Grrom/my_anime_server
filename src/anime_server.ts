import { createServer } from "http";
import { getRoutes } from "./router/get.routes";
import { postRoutes } from "./router/post.routes";

export class AnimeServer {
    hostname = '127.0.0.1';
    port = 3000;

    constructor() {
        createServer(function (request: any, response: any) {
            switch (request.method) {
                case "GET":
                    getRoutes(request, response);
                    break;
                case "POST":
                    postRoutes(request, response);
                case "OPTIONS":
                    response.writeHead(200, {
                        "Access-Control-Allow-Headers": "Content-Type, Accept",
                        "Access-Control-Allow-Origin": "http://localhost:8080",
                        "Access-Control-Allow-Methods": "POST",
                    })
                    response.end()
                    break
            }
        }).listen(this.port, this.hostname, () => {
            console.log(`Server running at http://${this.hostname}:${this.port}/`);
        });
    }
}


