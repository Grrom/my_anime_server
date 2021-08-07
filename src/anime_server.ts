import { createServer } from "http";
import { allowedOrigin, hostname, port } from "./helper";
import { getRoutes } from "./router/get.routes";
import { postRoutes } from "./router/post.routes";

export class AnimeServer {

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
                        "Access-Control-Allow-Origin": allowedOrigin(request.headers.origin),
                        "Access-Control-Allow-Methods": "POST",
                    })
                    response.end()
                    break
            }

        }).listen(port, hostname, () => {
            console.log(`Server running at http://${hostname}:${port}/`);
        });
    }
}


