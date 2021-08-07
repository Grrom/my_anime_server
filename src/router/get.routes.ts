import { allowedOrigin, noEndpoint, whitelisted } from "../helper";
import { animeList, getAsset, MyAnimeClient, video } from "../methods/get";


export function getRoutes(request: any, response: any) {
    const baseURL = `${request.headers.referer !== undefined ? request.headers.referer.split(":")[0] : "http"}://${request.headers.host}/`;
    const requestUrl: URL = new URL(request.url, baseURL);
    const origin = request.headers.origin;

    if (whitelisted(request.ip || request.connection.remoteAddress || request.socket.remoteAddress)) {
        switch (requestUrl.pathname) {

            case "/":
                const pageResponse = MyAnimeClient(origin);
                response.writeHead(pageResponse.statusCode, pageResponse.headers)
                response.write(pageResponse.data)
                response.end();
                break;

            case "/anime-list":
                const listResponse = animeList(origin);
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

                let requestExtension = requestUrl.pathname.split('.').pop()
                if (["js"].includes(requestExtension!)) {
                    const assetResponse = getAsset(requestUrl.pathname, requestExtension!, origin);
                    response.writeHead(assetResponse.statusCode, assetResponse.headers)
                    response.write(assetResponse.data)
                    response.end();
                } else {

                    console.log(request.headers)
                    let noEndpointResponse = noEndpoint(requestUrl)
                    console.log("no endpoint for " + requestUrl.pathname)
                    response.writeHead(noEndpointResponse.statusCode, noEndpointResponse.headers)
                    response.write(noEndpointResponse.data)
                    response.end()
                }
                break;
        }
    } else {
    }
}