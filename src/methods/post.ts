import { ApiResponse } from "../types/types";

export function saveProgress(): ApiResponse<String> {
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:8080",
        "Access-Control-Allow-Methods": "POST",
    };

    return { statusCode: 200, headers: headers, data: JSON.stringify("save progresss") };

}