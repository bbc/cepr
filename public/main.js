const { app, BrowserWindow } = require('electron');

function createWindow() {
	// Create the browser window.
	let win = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: true,
			devTools: true,
		},
	});

	const windowURL =
		process.env.NODE_ENV === 'development'
			? 'http://localhost:3000/'
			: 'https://cepr-static-hosting-int.s3-eu-west-1.amazonaws.com/index.html';

	// and load the index.html of the app.
	win.loadURL(windowURL);
}

app.on('ready', createWindow);
