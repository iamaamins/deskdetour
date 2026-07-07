import { App, ipcMain } from 'electron';
import { isMac, isWin } from './config';
import { LaunchAtLoginSettings } from '../types';

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

export function handleSettingsEvents(app: App) {
  ipcMain.handle('settings:get-launch-at-login', () =>
    getLaunchAtLoginSettings(app),
  );

  ipcMain.handle(
    'settings:set-launch-at-login',
    (_event, openAtLogin: boolean) => {
      app.setLoginItemSettings({ openAtLogin });
      return getLaunchAtLoginSettings(app);
    },
  );
}
