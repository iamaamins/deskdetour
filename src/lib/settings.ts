import { App, BrowserWindow, ipcMain } from 'electron';
import { isMac, isWin } from './config';
import { LaunchAtLoginSettings } from '../types';
import { assertTrustedSender } from './ipc';

function getLaunchAtLoginSettings(app: App): LaunchAtLoginSettings {
  if (!isMac && !isWin) {
    return { openAtLogin: false, isSupported: false };
  }

  const settings = app.getLoginItemSettings();

  return {
    openAtLogin: settings.openAtLogin,
    isSupported: true,
    status: settings.status,
  };
}

export function handleSettingsEvents(app: App, mainWindow: BrowserWindow) {
  ipcMain.handle('settings:get-launch-at-login', (event) => {
    assertTrustedSender(event, mainWindow);
    return getLaunchAtLoginSettings(app);
  });

  ipcMain.handle(
    'settings:set-launch-at-login',
    (event, openAtLogin: boolean) => {
      assertTrustedSender(event, mainWindow);
      app.setLoginItemSettings({ openAtLogin });
      return getLaunchAtLoginSettings(app);
    },
  );
}
