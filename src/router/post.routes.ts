import { noEndpoint } from "../helper";
import { saveProgress } from "../methods/post";

export function postRoutes(request: any, response: any) {
    const baseURL = `${request.headers.referer.split(":")[0]}://${request.headers.host}/`;
    const requestUrl: URL = new URL(request.url, baseURL);
    switch (requestUrl.pathname) {

        case "/save-progress":
            const saveResponse = saveProgress(request);
            response.writeHead(saveResponse.statusCode, saveResponse.headers)
            response.write(saveResponse.data);
            response.end();
            break;

        default:
            let noEndpointResponse = noEndpoint(request)
            response.writeHead(noEndpointResponse.statusCode, noEndpointResponse.headers)
            response.write(noEndpointResponse.data)
            response.end()
            break;
    }
}