import {
  App,
  BrowserWindow,
  Menu,
  Tray,
  shell,
  MenuItemConstructorOptions,
} from 'electron';
import {
  resetTimer,
  pauseTimer,
  resumeTimer,
  stopTimers,
  isTimerPaused,
} from './timer';
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

  function buildTrayMenu() {
    const isPaused = isTimerPaused();
    const contextMenu = Menu.buildFromTemplate([
      {
        label: `Open ${app.name}`,
        click: () => {
          mainWindow.show();
          if (isMac) app.dock?.show();
        },
      },
      { type: 'separator' },
      {
        label: 'Reset Timer',
        click: () => {
          resetTimer();
          buildTrayMenu();
        },
      },
      {
        label: 'Pause Timer',
        visible: !isPaused,
        click: () => {
          pauseTimer();
          buildTrayMenu();
        },
      },
      {
        label: 'Resume Timer',
        visible: isPaused,
        click: () => {
          resumeTimer();
          buildTrayMenu();
        },
      },
      { type: 'separator' },
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
  }

  buildTrayMenu();
  tray.setToolTip(app.name);

  return tray;
}

export function createApplicationMenu(app: App) {
  const windowSubmenuItemOptions: MenuItemConstructorOptions[] = isMac
    ? [{ type: 'separator' }, { role: 'front' }]
    : [{ role: 'close' }];

  const menuItemOptions: MenuItemConstructorOptions[] = [
    ...(isMac
      ? [
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
          } as MenuItemConstructorOptions,
        ]
      : []),
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
