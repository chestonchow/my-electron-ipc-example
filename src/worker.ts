import { ipcRenderer } from 'electron'

function doWork(input: number) {
  // Something cpu-intensive.
  return input * 2
}
  
// We might get multiple clients, for instance if there are multiple windows,
// or if the main window reloads.
ipcRenderer.on('new-client', (event) => {
  const [ port ] = event.ports;
  port.onmessage = (event) => {
    // The event data can be any serializable object (and the event could even
    // carry other MessagePorts with it!)
    const result = doWork(event.data)
    console.log(event.data)
    port.postMessage(result)
  }
})