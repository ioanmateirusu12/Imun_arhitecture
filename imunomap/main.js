// ============================================================================
// ImunoMap — Electron Main Process
// ============================================================================
// Acest fișier creează fereastra desktop, configurează meniul nativ, gestionează
// ciclul de viață al aplicației și expune un context izolat pentru procesul
// renderer (index.html).
// ============================================================================

const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = process.argv.includes('--dev');

let mainWindow = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1200,
    minHeight: 760,
    backgroundColor: '#0b1020',
    title: 'ImunoMap — Atlas Interactiv al Sistemului Imun',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false,
    },
    show: false,
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) mainWindow.webContents.openDevTools({ mode: 'detach' });
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

function buildMenu() {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about', label: 'Despre ImunoMap' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' }, { role: 'hideOthers' }, { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit', label: 'Ieșire' }
      ]
    }] : []),
    {
      label: 'Fișier',
      submenu: [
        {
          label: 'Script ImmunoScript Nou',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow && mainWindow.webContents.send('menu:new-script')
        },
        {
          label: 'Deschide Script…',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const res = await dialog.showOpenDialog(mainWindow, {
              title: 'Deschide script ImmunoScript',
              filters: [{ name: 'ImmunoScript', extensions: ['imm', 'is', 'txt'] }],
              properties: ['openFile']
            });
            if (!res.canceled && res.filePaths[0]) {
              const content = fs.readFileSync(res.filePaths[0], 'utf-8');
              mainWindow.webContents.send('menu:open-script', { path: res.filePaths[0], content });
            }
          }
        },
        {
          label: 'Salvează Script…',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow && mainWindow.webContents.send('menu:save-script')
        },
        { type: 'separator' },
        { role: isMac ? 'close' : 'quit', label: isMac ? 'Închide fereastra' : 'Ieșire' }
      ]
    },
    {
      label: 'Vizualizare',
      submenu: [
        { label: 'Hartă imună',    accelerator: 'CmdOrCtrl+1', click: () => send('view:map') },
        { label: 'Genetică',       accelerator: 'CmdOrCtrl+2', click: () => send('view:genetics') },
        { label: 'Biochimie',      accelerator: 'CmdOrCtrl+3', click: () => send('view:biochemistry') },
        { label: 'Tehnici',        accelerator: 'CmdOrCtrl+4', click: () => send('view:techniques') },
        { label: 'ImmunoScript IDE', accelerator: 'CmdOrCtrl+5', click: () => send('view:ide') },
        { label: 'Simulator',      accelerator: 'CmdOrCtrl+6', click: () => send('view:simulator') },
        { type: 'separator' },
        { role: 'reload' }, { role: 'forceReload' }, { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Ajutor',
      submenu: [
        {
          label: 'Documentație ImmunoScript',
          click: () => send('view:ide', { showDocs: true })
        },
        {
          label: 'Despre',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Despre ImunoMap',
              message: 'ImunoMap v1.0',
              detail:
                'Atlas interactiv al sistemului imun + limbaj de programare ImmunoScript.\n\n' +
                'Date integrate din „Tehnici utilizate în imunologie — Noțiuni introductive"\n' +
                'de Prof. Petru Cianga (Editura PIM, 2008).\n\n' +
                'Conține: celule, citokine, CD, complement, HLA, V(D)J, ' +
                'căi de semnalizare, tehnici de laborator și un DSL complet.'
            });
          }
        }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function send(channel, payload) {
  if (mainWindow) mainWindow.webContents.send(channel, payload);
}

// ---------------------------------------------------------------------------
// IPC handlers — expose limited file-system access to the renderer
// ---------------------------------------------------------------------------
ipcMain.handle('dialog:save-script', async (_e, content) => {
  const res = await dialog.showSaveDialog(mainWindow, {
    title: 'Salvează script ImmunoScript',
    defaultPath: 'script.imm',
    filters: [{ name: 'ImmunoScript', extensions: ['imm'] }]
  });
  if (res.canceled || !res.filePath) return { ok: false };
  fs.writeFileSync(res.filePath, content, 'utf-8');
  return { ok: true, path: res.filePath };
});

ipcMain.handle('dialog:export-svg', async (_e, svgContent) => {
  const res = await dialog.showSaveDialog(mainWindow, {
    title: 'Exportă harta ca SVG',
    defaultPath: 'imunomap.svg',
    filters: [{ name: 'SVG', extensions: ['svg'] }]
  });
  if (res.canceled || !res.filePath) return { ok: false };
  fs.writeFileSync(res.filePath, svgContent, 'utf-8');
  return { ok: true, path: res.filePath };
});

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------
app.whenReady().then(() => {
  createMainWindow();
  buildMenu();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
