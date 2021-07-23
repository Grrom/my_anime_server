import { AnimeServer } from "./anime_server";

new AnimeServer();



// http.createServer((request: any, response: any) => {

//     switch (parse(request.url, true).pathname) {
//         case "/anime-list":
//             animeList
//             break;
//         case "/save-progress":
//             break;
//         case "/video":
//             const query = parse(request.url, true).query;
//             const requestVideo = `./anime/${query.anime}/${query.episode}`;
//             const videoSize = statSync(requestVideo).size;

//             const range = request.headers.range;
//             if (range) {
//                 const CHUNK_SIZE = 10 ** 6;
//                 const start = Number(range.replace(/\D/g, ""));
//                 const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

//                 response.writeHead(206, {
//                     "Content-Range": `bytes ${start}-${end}/${videoSize}`,
//                     "Accept-Ranges": "bytes",
//                     "Content-Length": end - start + 1,
//                     "Content-Type": "video/mp4",
//                     "Access-Control-Allow-Origin": "http://localhost:8080",
//                     "Access-Control-Allow-Headers": "Range",
//                     "Access-Control-Allow-Methods": "GET",
//                 });

//                 createReadStream(requestVideo, { start, end }).pipe(response)

//             } else {
//                 stat(requestVideo, (err: any, stats: any) => {
//                     if (err !== null && err.code === "ENOENT") {
//                         response.writeHead(404)
//                     }
//                     const fileSize = stats.size

//                     response.writeHead(206, {
//                         'Content-Length': fileSize,
//                         'Content-Type': 'video/mp4',
//                         "Accept-Ranges": "bytes",
//                         "Access-Control-Allow-Headers": "Range",
//                         "Access-Control-Allow-Origin": "http://localhost:8080",
//                         "Access-Control-Allow-Methods": "GET",
//                     });

//                     createReadStream(requestVideo).pipe(response);
//                 })
//             }
//             break;
//         default:
//             response.writeHead(
//                 200, {
//                 "Access-Control-Allow-Origin": "http://localhost:8080",
//                 "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
//             });
//             console.log(parse(request.url, true).pathname)
//             response.write(JSON.stringify("hello"))
//             response.end()
//     }
// }).listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });

// function writeAllowedMethods() {

// }

// function animeList(response: any) {
//     response.writeHead(200, {
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Origin": "http://localhost:8080",
//         "Access-Control-Allow-Methods": "GET",
//     });
//     let animes: { [k: string]: string } = {};
//     readdirSync("./anime").forEach((animeName: string) => {
//         if (animeName !== ".keep")
//             animes[animeName] = readdirSync(`./anime/${animeName}`);
//     });
//     response.write(animes);
//     response.end();
// }

// const animeLista = (): string => {
//     let animes: { [k: string]: string } = {};
//     readdirSync("./anime").forEach((animeName: string) => {
//         if (animeName !== ".keep")
//             animes[animeName] = readdirSync(`./anime/${animeName}`);
//     });
//     return JSON.stringify(animes);
// }

// const saveProgress = () => {
//     let x: String = JSON.stringify("none");
//     access("./records.json", F_OK, (err) => {
//         if (err) {
//         } else {
//             readFile("./records.json", "utf8", (err, file) => {
//                 file = JSON.parse(file);
//                 writeFile("./records.json", JSON.stringify(file), function (err) {
//                     if (err) throw err;
//                     console.log("written")
//                 })
//             })
//         }
//     })
// }
