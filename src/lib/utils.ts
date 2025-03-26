import { App } from 'electron';
import path from 'node:path';
import { isDev, isMac, isWin } from './config';
import AutoLaunch from 'auto-launch';
import { exec } from 'child_process';

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

export function playNotificationSound(app: App, type: 'view' | 'move') {
  const filename = `${type}-notification.mp3`;
  const filePath = isDev
    ? path.join(app.getAppPath(), 'src', 'assets', filename)
    : path.join(process.resourcesPath, 'assets', filename);

  if (isMac) return exec(`afplay "${filePath}"`);

  if (isWin)
    return exec(
      `powershell -c "& {Add-Type -AssemblyName presentationCore; $mediaPlayer = New-Object system.windows.media.mediaplayer; $mediaPlayer.open('${filePath}'); $mediaPlayer.Play()}"`,
    );
}
