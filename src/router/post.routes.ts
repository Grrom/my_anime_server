import { saveProgress } from "../methods/post";

export function postRoutes(request: any, response: any) {
    const baseURL = `${request.headers.referer.split(":")[0]}://${request.headers.host}/`;
    const requestUrl: URL = new URL(request.url, baseURL);
    switch (requestUrl.pathname) {

        case "/save-progress":
            const saveResponse = saveProgress();
            response.writeHead(saveResponse.statusCode, saveResponse.headers)
            response.write(saveResponse.data);
            response.end();
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