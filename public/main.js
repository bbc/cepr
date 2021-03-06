const { app, BrowserWindow } = require('electron')
const { localStorage, sessionStorage } = require('electron-browser-storage');

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadURL('http://localhost:3000/')
}

app.on('ready', createWindow)