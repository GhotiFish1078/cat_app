const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { fileURLToPath } = require('url');

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Basically a single instance of a render process (or just a tab in a sense)
// TO allow for many windows, use an array to store them all
let window;

// Step 1: Create a bunch of event callback loops to manage app lifecycle

// For all of these callback arrow functions, technically an "event" object
// is passed to them, but beacuse the parameter list is empty, the
// "event" object simply isn't used. For example
// app.on('quit', (event, exitcode) => {
//     console.log(event);
//     console.log(exitcode);
// })
// Use the documentation to see what the event returns

// .once() is an inherited method from EventEmitter
// The idea is that once the 'ready' event is called
// the call function is ran
// .once() basically subscribes to the event once
// .on() is indefinite until unsubscribed
app.on('ready', () => {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    // Load the static HTML page
    window.loadFile(path.join(__dirname, 'index.html'));
});

// Mainly to deal with mac compatbility
// Basically, the app is still "running", but all the render processes are stuff
// are killed which ar then restarted using the below code. 
//
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        window = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
            },
        });
        window.loadFile('index.html');
    }
});

// Ensures mac compatability
// Basically, if you aren't a mac and all windows are closed, the program exits
// However on mac, the program doesn't 'quit' 
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Step 2 Hook up the IPCMain

ipcMain.handle('fetch-cat', async () => {
    try {
        const response = await fetch('https://cataas.com/cat', {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const imageBuffer = await response.arrayBuffer(); // Fetch the image as a binary buffer
        const base64Image = `data:image/jpeg;base64,${Buffer.from(imageBuffer).toString('base64')}`;
        return base64Image;
    } catch (error) {
        console.error('Failed to fetch cat image:', error);
        return null;
    }
});

