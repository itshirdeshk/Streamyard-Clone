const userVideo = document.getElementById("user-video")
const startBtn = document.getElementById("start-btn");
const socket = io();
const state = { media: null };

startBtn.addEventListener("click", () => {
    const mediaRecorder = new MediaRecorder(state.media, {
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 250000,
        framerate: 25
    })

    mediaRecorder.ondataavailable = ev => {
        socket.emit("binarystream", ev.data);
    }
    mediaRecorder.start(25);
})

window.addEventListener('load', async e => {
    const media = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    state.media = media;
    userVideo.srcObject = media;
})
