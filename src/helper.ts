import { ApiResponse } from "./types/types";

export const hostname = "127.0.0.1";
export const port = 3000;

export function whitelisted(ip: string): boolean {
    let whitelistedIp = [
        "127.0.0.1"
    ]
    return whitelistedIp.includes(ip)
}

export function allowedOrigin(origin: string) {
    let allowedOrigins = [
        "http://localhost:8080",
    ]

    if (allowedOrigins.includes(origin)) {
        return origin
    } else {
        return "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
}

export function noEndpoint(requestUrl: any): ApiResponse<any> {
    let expectedResponse = requestUrl.headers.accept.split(",")[0]

    let data = "no resource found";
    const headers = {
        "Content-Type": expectedResponse,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
    }

    switch (expectedResponse) {
        case "text/html":
            data = "<h1>The resource you requested is not available</h1>"
            data += "<h4>Here, get rickrolled instead</h4>"
            data += "<img src='https://media.giphy.com/media/Vuw9m5wXviFIQ/giphy.gif'></img>"
            break;
        case "application/json":
        default:
            data = JSON.stringify("We couldn't find the resource you requested, check this out instead: https://www.youtube.com/watch?v=dQw4w9WgXcQ ")
    }
    console.log("no endpoint for " + requestUrl.pathname)

    return { statusCode: 200, headers: headers, data: data }
}
