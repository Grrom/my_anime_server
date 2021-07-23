import { createServer } from "http";
import { animeList, video, } from "./methods/get";

export class AnimeServer {
    hostname = '127.0.0.1';
    port = 3000;

    constructor() {
        createServer(function (request: any, response: any) {
            const baseURL = `${request.headers.referer.split(":")[0]}://${request.headers.host}/`;
            const requestUrl: URL = new URL(request.url, baseURL);

            switch (requestUrl.pathname) {

                case "/anime-list":
                    const listResponse = animeList();
                    response.writeHead(listResponse.statusCode, listResponse.headers)
                    response.write(listResponse.data);
                    response.end();
                    break;

                case "/video":
                    const vidResponse = video(requestUrl, request.headers)
                    response.writeHead(vidResponse.statusCode, vidResponse.headers)
                    vidResponse.data.pipe(response)
                    break;

                default:
                    const headers = {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "http://localhost:8080",
                        "Access-Control-Allow-Methods": "GET",
                    }
                    console.log(requestUrl)
                    response.writeHead(200, headers)
                    response.write(JSON.stringify("testing"))
                    response.end()
                    break;
            }
        }).listen(this.port, this.hostname, () => {
            console.log(`Server running at http://${this.hostname}:${this.port}/`);
        });
    }
}

