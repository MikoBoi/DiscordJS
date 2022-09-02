const { app, BrowserWindow } = require ('electron');

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 1000,
        height: 800,
        minWidth: 1000,
        minHeight: 800,
        icon: __dirname + '/app.ico',
    });

    win.loadURL(`file://${__dirname}/index.html`);

    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});