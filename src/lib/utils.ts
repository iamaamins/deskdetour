import { App } from 'electron';
import path from 'node:path';
import { isDev, isMac } from './config';
import AutoLaunch from 'auto-launch';

export function getTrayIconPath(app: App) {
  const icon = isMac ? 'trayIconTemplate.png' : 'trayIcon.png';

  return isDev
    ? path.join(app.getAppPath(), 'src', 'assets', icon)
    : path.join(process.resourcesPath, 'assets', icon);
}

export async function setApplicationAsLoginItem(app: App) {
  const autoLauncher = new AutoLaunch({ name: app.name });

  try {
    const isEnabled = await autoLauncher.isEnabled();
    if (!isEnabled) await autoLauncher.enable();
  } catch (err) {
    console.error('Error enabling auto launch');
  }
}

export function playMoveNotificationSound(app: App) {
  const filename = 'move-notification.mp3';
  const filePath = isDev
    ? path.join(app.getAppPath(), 'src', 'assets', filename)
    : path.join(process.resourcesPath, 'assets', filename);

  if (isMac) {
    require('child_process').exec(`afplay "${filePath}"`);
  } else {
    require('child_process').exec(
      `powershell -c (New-Object Media.SoundPlayer "${filePath}").PlaySync()`,
      (err: Error) => console.error('Error playing sound on Windows:', err),
    );
  }
}
