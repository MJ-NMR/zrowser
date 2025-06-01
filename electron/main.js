const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('path');
const { getRequestBody }= require('../back/request.js');
const fs = require('fs');
const crypto = require('crypto');

const createWindow = (tempPath = 'electron/default/index.html' ) => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload : path.join(__dirname, 'preload.js')
		},
	});
	win.loadFile(tempPath);
}

app.whenReady().then(() => {
	ipcMain.handle('browser:run', async (_event, urlStr) => {

		console.log('main handler');
		const hash = crypto.createHash('sha256').update(urlStr).digest('hex');
		const cashepath = path.join(__dirname, `default/temp/${urlStr}.html`);
		let tempPath;

		if(fs.existsSync(cashepath)) tempPath = cashepath;
		try {
			const res =  await getRequestBody(urlStr);
			tempPath = path.join(__dirname, `default/temp/${hash}.html`)
			console.log(tempPath);
			fs.writeFileSync(tempPath, res)
		} catch (err) {
			console.log(err);
		}

		createWindow(tempPath);
	});
	createWindow();
	app.on('activate', () => {
	if(BrowserWindow.getAllWindows().length === 0) createWindow();
	});
})

app.on('window-all-closed', () => {
	if(process.platform !== 'darwin') app.quit();
})

