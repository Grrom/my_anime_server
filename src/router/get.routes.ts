import { animeList, video } from "../methods/get";
import { saveProgress } from "../methods/post";

export function getRoutes(request: any, response: any) {
    const baseURL = `${request.headers.referer.split(":")[0]}://${request.headers.host}/`;
    const requestUrl: URL = new URL(request.url, baseURL);
    switch (requestUrl.pathname) {

        case "/anime-list":
            const listResponse = animeList();
            response.writeHead(listResponse.statusCode, listResponse.headers)
            response.write(listResponse.data);
            response.end();
            break;

        case "/save-progress":
            const saveResponse = saveProgress();
            response.writeHead(saveResponse.statusCode, saveResponse.headers)
            response.write(saveResponse.data);
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
}