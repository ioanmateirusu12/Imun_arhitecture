// ============================================================================
// Preload — expune un API sigur procesului renderer.
// ============================================================================
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('imuno', {
  onMenu: (channel, handler) => {
    const allowed = [
      'menu:new-script', 'menu:open-script', 'menu:save-script',
      'view:map', 'view:genetics', 'view:biochemistry',
      'view:techniques', 'view:ide', 'view:simulator'
    ];
    if (!allowed.includes(channel)) return;
    ipcRenderer.on(channel, (_e, data) => handler(data));
  },
  saveScript:  (content) => ipcRenderer.invoke('dialog:save-script', content),
  exportSvg:   (content) => ipcRenderer.invoke('dialog:export-svg', content),
  platform:    process.platform,
  versions:    process.versions
});
