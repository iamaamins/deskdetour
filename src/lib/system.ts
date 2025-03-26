import {
  App,
  BrowserWindow,
  Menu,
  Tray,
  shell,
  MenuItemConstructorOptions,
} from 'electron';
import { resetMainTimer, stopTimers } from './timer';
import { isMac } from './config';
import { getTrayIconPath } from './utils';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    webPreferences: {
      devTools: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  return mainWindow;
}

export function createTray(app: App, mainWindow: BrowserWindow) {
  const tray = new Tray(getTrayIconPath(app));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: `Open ${app.name}`,
      click: () => {
        mainWindow.show();
        if (isMac) app.dock.show();
      },
    },
    { label: 'Reset Timer', click: () => resetMainTimer() },
    {
      label: `Quit ${app.name}`,
      click: () => {
        mainWindow.removeAllListeners();
        tray.removeAllListeners();
        stopTimers();
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip(app.name);

  return tray;
}

export function createApplicationMenu(app: App) {
  const windowSubmenuItemOptions: MenuItemConstructorOptions[] = isMac
    ? [{ type: 'separator' }, { role: 'front' }]
    : [{ role: 'close' }];

  const menuItemOptions: MenuItemConstructorOptions[] = [
    {
      role: 'appMenu',
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      role: 'fileMenu',
      label: 'File',
      submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
    },
    {
      role: 'viewMenu',
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      role: 'windowMenu',
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...windowSubmenuItemOptions,
      ],
    },
    {
      role: 'help',
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click: async () =>
            await shell.openExternal('https://www.deskdetour.com'),
        },
      ],
    },
  ];

  const updatedMenu = Menu.buildFromTemplate(menuItemOptions);
  Menu.setApplicationMenu(updatedMenu);
}
