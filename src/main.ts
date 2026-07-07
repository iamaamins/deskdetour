import { app } from 'electron';
import started from 'electron-squirrel-startup';
import { startTimers, handleEvents } from './lib/timer';
import { isMac } from './lib/config';
import {
  createMainWindow,
  createTray,
  createApplicationMenu,
} from './lib/system';

if (started) app.quit();

app.on('ready', () => {
  const mainWindow = createMainWindow();
  const { tray, updateTrayMenu } = createTray(app, mainWindow);
  createApplicationMenu(app);

  startTimers(app, mainWindow, tray);

  mainWindow.on('close', (e) => {
    e.preventDefault();
    mainWindow.hide();
    if (isMac) app.dock?.hide();
  });
  handleEvents(app, mainWindow, tray, updateTrayMenu);
});
