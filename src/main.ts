import { app } from 'electron';
import started from 'electron-squirrel-startup';
import { startTimers, handleEvents } from './lib/timer';
import { isMac } from './lib/config';
import {
  createMainWindow,
  createTray,
  createApplicationMenu,
} from './lib/system';
import { setApplicationAsLoginItem } from './lib/utils';
import { initiateUpdateChecker } from './lib/update';

if (started) app.quit();

app.on('ready', async () => {
  // System functions
  const mainWindow = createMainWindow(app);
  const tray = createTray(app, mainWindow);
  createApplicationMenu(app);
  await setApplicationAsLoginItem(app);

  // Start update checker
  initiateUpdateChecker(mainWindow);

  // Start timers
  startTimers(app, mainWindow, tray);

  // Event listeners
  mainWindow.on('close', (e) => {
    e.preventDefault();
    mainWindow.hide();
    if (isMac) app.dock.hide();
  });
  handleEvents(app, mainWindow, tray);
});
