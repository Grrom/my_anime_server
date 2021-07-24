import { F_OK } from "constants";
import { access, PathLike, writeFile, openSync, readFileSync } from "fs";
import { AnimeList, ApiResponse, WatchedAnime, } from "../types/types";

export function saveProgress(request: any): ApiResponse<String> {
    const headers = {
        "Accept-Post": "application/json ",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:8080",
        "Access-Control-Allow-Methods": "POST",
    };

    const chunks: Array<Buffer> = [];

    request.on("data", function (data: any) {
        chunks.push(data)
    })

    request.on("end", async function () {
        const data = Buffer.concat(chunks)
        saveToFile(JSON.parse(data.toString()));
    })

    return { statusCode: 200, headers: headers, data: JSON.stringify("save progresss") }

    async function saveToFile(body: WatchedAnime) {
        const fileName: PathLike = "./watched.json"
        access(fileName, F_OK, (error) => {
            if (error) {
                openSync(fileName, "w");
                saveToFile(body);
            } else {
                const file = readFileSync(fileName, "utf8");
                let watched: AnimeList = file.length !== 0 ? JSON.parse(file) : {};

                if (watched[body.name] === undefined)
                    watched[body.name] = [];
                if (watched[body.name].includes(body.episode)) {
                    console.log("saved already");
                } else {
                    watched[body.name].push(body.episode);
                    writeFile(fileName, JSON.stringify(watched), function (err) {
                        if (err) throw err;
                    });
                }
            }
        });
    }
}