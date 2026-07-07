import { App, Notification } from 'electron';
import path from 'node:path';
import { isDev, isMac, isWin } from './config';
import { exec } from 'child_process';
import { NotificationBody, NotificationTitle } from '../../src/types';

export function getTrayIconPath(app: App) {
  const icon = isMac ? 'trayIconTemplate.png' : 'icon.ico';

  return isDev
    ? path.join(app.getAppPath(), 'src', 'assets', icon)
    : path.join(process.resourcesPath, 'assets', icon);
}

export function playNotificationSound(
  app: App,
  type: 'view' | 'move' | 'break-over',
) {
  const filename = `${type}-notification.wav`;
  const filePath = isDev
    ? path.join(app.getAppPath(), 'src', 'assets', filename)
    : path.join(process.resourcesPath, 'assets', filename);

  if (isMac) exec(`afplay "${filePath}"`);

  if (isWin)
    exec(
      `powershell -c (New-Object Media.SoundPlayer '${filePath}').PlaySync()`,
    );
}

export const notify = (title: NotificationTitle, body: NotificationBody) =>
  new Notification({ title, body, silent: true }).show();

export const formatTime = (time: number) => time.toString().padStart(2, '0');
