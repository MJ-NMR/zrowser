const { contextBridge , ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('browser' , {
	run: (urlStr) => ipcRenderer.invoke('browser:run', urlStr)
});
