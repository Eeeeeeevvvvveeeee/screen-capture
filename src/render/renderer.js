const { ipcRenderer } = require("electron");

document.getElementById("camera-btn").addEventListener("click", () => {
    ipcRenderer.send("capture-screen");
});

document.getElementById("minimize-btn").addEventListener("click", () => {
    ipcRenderer.send("window-minimize");
});

document.getElementById("maximize-btn").addEventListener("click", () => {
    ipcRenderer.send("window-maximize");
});

document.getElementById("close-btn").addEventListener("click", () => {
    ipcRenderer.send("window-close");
});