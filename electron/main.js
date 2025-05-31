const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('path');
const back = require('../back/app.js');
const browser = new back.browser()

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload : path.join(__dirname, 'preload.js')
		},
	});
	win.loadFile('electron/default/index.html');
}

app.whenReady().then(() => {
	ipcMain.handle('browser:run', async (_event, urlStr) => {
		console.log('main handler');
		try {
		const res =  await browser.run(urlStr);
		return res;
		} catch (err) {
			return 'error in browser'
		}
	});
	createWindow();
	app.on('activate', () => {
	if(BrowserWindow.getAllWindows().length === 0) createWindow();
	});
})

app.on('window-all-closed', () => {
	if(process.platform !== 'darwin') app.quit();
})

