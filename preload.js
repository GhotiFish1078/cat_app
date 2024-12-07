const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    fetchCat: () => ipcRenderer.invoke('fetch-cat'),
});
