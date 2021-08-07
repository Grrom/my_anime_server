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
