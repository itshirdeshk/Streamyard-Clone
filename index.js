import http from "http";
import express from "express";
import { spawn } from "child_process"
import path from "path";
import { Server as SocketIO } from "socket.io";

const options = [
    '-i',
    '-',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-r', `${25}`,
    '-g', `${25 * 2}`,
    '-keyint_min', 25,
    '-crf', '25',
    '-pix_fmt', 'yuv420p',
    '-sc_threshold', '0',
    '-profile:v', 'main',
    '-level', '3.1',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', 128000 / 4,
    '-f', 'flv',
    `rtmp://a.rtmp.youtube.com/live2`,
];

const ffmpegProcess = spawn('ffmpeg', options);
ffmpegProcess.stdout.on("data", (data) => {
    console.log(`ffmpeg stdout: ${data}`);
})
ffmpegProcess.stderr.on("data", (data) => {
    console.log(`ffmpeg stderr: ${data}`);
})
ffmpegProcess.on("close", (code) => {
    console.log(`ffmpeg process closed with code: ${code}`);
})

const app = express();
const server = http.createServer(app);

const io = new SocketIO(server);

io.on("connection", socket => {
    console.log("Socket Connected", socket.id);

    socket.on("binarystream", (stream) => {
        console.log("Stream");
        ffmpegProcess.stdin.write(stream, (err) => {
            console.log('Err', err);
        })
    })
})

app.use(express.static(path.resolve("./public")))

server.listen(3000, () => console.log(`HTTP Server is listening on the PORT: 3000`))