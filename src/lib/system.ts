import {
  App,
  BrowserWindow,
  Menu,
  Tray,
  MenuItemConstructorOptions,
} from 'electron';
import {
  resetTimer,
  pauseTimer,
  resumeTimer,
  stopTimers,
  isTimerPaused,
} from './timer';
import { isDev, isMac } from './config';
import { getTrayIconPath, openAllowedExternalUrl } from './utils';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export type TrayController = {
  tray: Tray;
  updateTrayMenu: () => void;
};

function isAppUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    const appUrl = new URL(MAIN_WINDOW_WEBPACK_ENTRY);
    return (
      parsedUrl.protocol === appUrl.protocol &&
      parsedUrl.origin === appUrl.origin &&
      parsedUrl.pathname === appUrl.pathname
    );
  } catch {
    return url === MAIN_WINDOW_WEBPACK_ENTRY;
  }
}

export function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    webPreferences: {
      devTools: isDev,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.webContents.setWindowOpenHandler((details) => {
    openAllowedExternalUrl(details.url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (isAppUrl(url)) return;

    event.preventDefault();
    openAllowedExternalUrl(url);
  });

  return mainWindow;
}

export function createTray(
  app: App,
  mainWindow: BrowserWindow,
): TrayController {
  const tray = new Tray(getTrayIconPath(app));

  const updateTrayMenu = () => {
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
          updateTrayMenu();
        },
      },
      {
        label: 'Pause Timer',
        visible: !isPaused,
        click: () => {
          pauseTimer();
          updateTrayMenu();
        },
      },
      {
        label: 'Resume Timer',
        visible: isPaused,
        click: () => {
          resumeTimer();
          updateTrayMenu();
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
  };

  updateTrayMenu();
  tray.setToolTip(app.name);

  return { tray, updateTrayMenu };
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
            await openAllowedExternalUrl('https://www.deskdetour.com'),
        },
      ],
    },
  ];

  const updatedMenu = Menu.buildFromTemplate(menuItemOptions);
  Menu.setApplicationMenu(updatedMenu);
}
