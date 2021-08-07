import { animeList, getAsset, MyAnimeClient, video } from "../methods/get";

export function getRoutes(request: any, response: any) {
    const baseURL = `${request.headers.referer !== undefined ? request.headers.referer.split(":")[0] : "http"}://${request.headers.host}/`;
    const requestUrl: URL = new URL(request.url, baseURL);

    switch (requestUrl.pathname) {

        case "/":
            const pageResponse = MyAnimeClient();
            response.writeHead(pageResponse.statusCode, pageResponse.headers)
            response.write(pageResponse.data)
            response.end();
            break;

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

            let requestExtension = requestUrl.pathname.split('.').pop()
            if (["js"].includes(requestExtension!)) {
                const assetResponse = getAsset(requestUrl.pathname, requestExtension!);
                response.writeHead(assetResponse.statusCode, assetResponse.headers)
                response.write(assetResponse.data)
                response.end();
            } else {
                const headers = {
                    "Content-Type": "application/json; charset=UTF-8",
                    "Access-Control-Allow-Origin": "http://localhost:8080",
                    "Access-Control-Allow-Methods": "GET",
                }
                console.log("no endpoint for " + requestUrl.pathname)
                response.writeHead(200, headers)
                response.write(JSON.stringify("no endpoint matched"))
                response.end()
            }
            break;
    }
}