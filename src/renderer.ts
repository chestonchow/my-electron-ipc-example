// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

declare interface Window {
    api: {
        send: (data: number) => void;
        receive: () => void;
        refreshWorker: () => void;
    }
}

window.api.send(124);
window.api.send(541);
window.api.receive();
window.api.refreshWorker();
