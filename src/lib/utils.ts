import { App, Notification, shell } from 'electron';
import path from 'node:path';
import { isDev, isMac, isWin } from './config';
import { execFile } from 'node:child_process';
import { NotificationBody, NotificationTitle } from '../../src/types';

const allowedExternalHosts = new Set([
  'deskdetour.com',
  'www.deskdetour.com',
  'x.com',
  'youtu.be',
  'youtube.com',
  'www.youtube.com',
]);

export function getTrayIconPath(app: App) {
  const icon = isMac ? 'trayIconTemplate.png' : 'icon.ico';

  return isDev
    ? path.join(app.getAppPath(), 'src', 'assets', icon)
    : path.join(process.resourcesPath, 'assets', icon);
}

export async function openAllowedExternalUrl(url: string) {
  try {
    const parsedUrl = new URL(url);

    if (
      parsedUrl.protocol === 'https:' &&
      allowedExternalHosts.has(parsedUrl.hostname)
    ) {
      await shell.openExternal(url);
    }
  } catch {
    console.error(`URL not allowed to open: ${url}`);
  }
}

export function playNotificationSound(
  app: App,
  type: 'view' | 'move' | 'break-over',
) {
  const filename = `${type}-notification.wav`;
  const filePath = isDev
    ? path.join(app.getAppPath(), 'src', 'assets', filename)
    : path.join(process.resourcesPath, 'assets', filename);

  if (isMac) {
    execFile('/usr/bin/afplay', [filePath], (error) => {
      if (error) console.error('Error playing notification sound');
    });
  }

  if (isWin) {
    execFile(
      'powershell.exe',
      [
        '-NoProfile',
        '-NonInteractive',
        '-Command',
        '(New-Object Media.SoundPlayer $args[0]).PlaySync()',
        filePath,
      ],
      (error) => {
        if (error) console.error('Error playing notification sound');
      },
    );
  }
}

export const notify = (title: NotificationTitle, body: NotificationBody) =>
  new Notification({ title, body, silent: true }).show();

export const formatTime = (time: number) => time.toString().padStart(2, '0');
