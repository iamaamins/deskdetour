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

app.on('ready', async () => {
  // System functions
  const mainWindow = createMainWindow();
  const { tray, updateTrayMenu } = createTray(app, mainWindow);
  createApplicationMenu(app);

  // Start timers
  startTimers(app, mainWindow, tray);

  // Event listeners
  mainWindow.on('close', (e) => {
    e.preventDefault();
    mainWindow.hide();
    if (isMac) app.dock?.hide();
  });
  handleEvents(app, mainWindow, tray, updateTrayMenu);
});
