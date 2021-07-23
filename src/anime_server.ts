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
                    break
            }
        }).listen(this.port, this.hostname, () => {
            console.log(`Server running at http://${this.hostname}:${this.port}/`);
        });
    }
}


