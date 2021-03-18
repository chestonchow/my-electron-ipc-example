// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type as keyof NodeJS.ProcessVersions]);
  }
});

import { ipcRenderer, contextBridge } from 'electron';

contextBridge.exposeInMainWorld(
  'api', {
    receive: () => {
      ipcRenderer.send('request-worker-channel');
      ipcRenderer.once('provide-worker-channel', (event) => {
        // Once we receive the reply, we can take the port...
        const [ port ] = event.ports
        // ... register a handler to receive results ...
        port.onmessage = e => {
          console.log('received result:', e.data)
        }
      })
    },
    send: (data: any) => {
      ipcRenderer.send('request-worker-channel');
      ipcRenderer.once('provide-worker-channel', (event) => {
        // Once we receive the reply, we can take the port...
        const [ port ] = event.ports
        // ... register a handler to receive results ...
        port.postMessage(data)
        console.log('Sent', data)
      })
    },
    refreshWorker: () => {
      ipcRenderer.send('refresh-worker');
    }
  }
)
