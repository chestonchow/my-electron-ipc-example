import { app, BrowserWindow, ipcMain, MessageChannelMain } from "electron";
import * as path from "path";

let mainWindow: BrowserWindow;
let worker: BrowserWindow;

function createMainWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "setApi.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../index.html"));
}

function createWorkerWindow() {
  worker = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "worker.js"),
    },
  });

  //Has to load a file to a window, but doesn't matter what file it is
  worker.loadFile("main.js");
}

app.on("ready", () => {
  createMainWindow();
  createWorkerWindow();
});

ipcMain.on('request-worker-channel', (event) => {
  // For security reasons, let's make sure only the frames we expect can
  // access the worker.
  if (event.senderFrame === mainWindow.webContents.mainFrame) {
    // Create a new channel ...
    const { port1, port2 } = new MessageChannelMain()
    // ... send one end to the worker ...
    worker.webContents.postMessage('new-client', null, [port1])
    // ... and the other end to the main window.
    event.senderFrame.postMessage('provide-worker-channel', null, [port2])
    // Now the main window and the worker can communicate with each other
    // without going through the main process!
  }
})

ipcMain.on('refresh-worker', () => {
  worker.close();
  createWorkerWindow();
})
