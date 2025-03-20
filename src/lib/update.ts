import { app, BrowserWindow, dialog } from 'electron';
import { isDev } from './config';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

interface GithubRelease {
  tag_name: string;
  assets: Array<{
    name: string;
    browser_download_url: string;
  }>;
}

const GITHUB_API_URL =
  'https://api.github.com/repos/YOUR_USERNAME/DeskDetour/releases/latest';
const CHECK_INTERVAL = 1000 * 60 * 60 * 24; // Check every 24 hours

const getArch = (): string => (process.arch === 'arm64' ? 'arm64' : 'x64');

function getAssetPattern(): RegExp {
  const arch = getArch();

  if (process.platform === 'darwin') {
    return new RegExp(`DeskDetour.*?${arch}\\.dmg$`, 'i');
  } else if (process.platform === 'win32') {
    return new RegExp(`DeskDetour.*?${arch}\\.exe$`, 'i');
  }

  throw new Error(`Unsupported platform: ${process.platform}`);
}

async function cleanupMacOS(
  mountPoint: string,
  downloadPath: string,
): Promise<void> {
  try {
    await execSync(`hdiutil detach "${mountPoint}" -force`);
  } catch (err) {
    console.warn('Failed to detach DMG:', err);
  }

  try {
    fs.unlinkSync(downloadPath);
  } catch (err) {
    console.warn('Failed to delete download:', err);
  }
}

async function installMacOSUpdate(downloadPath: string): Promise<void> {
  const appName = 'Desk Detour.app';
  const mountPoint = '/Volumes/Desk Detour';

  try {
    // Mount the DMG
    execSync(`hdiutil attach "${downloadPath}"`);

    const appPath = path.join(mountPoint, appName);
    const currentAppPath = app.getPath('exe').replace('/MacOS/Desk Detour', '');

    // Copy the new version over the current one
    execSync(`cp -R "${appPath}" "${path.dirname(currentAppPath)}"`);

    // Cleanup
    await cleanupMacOS(mountPoint, downloadPath);

    // Just quit the app, the new version will be used next time
    app.quit();
  } catch (err) {
    await cleanupMacOS(mountPoint, downloadPath);
    throw err;
  }
}

async function installWindowsUpdate(downloadPath: string): Promise<void> {
  const currentExePath = app.getPath('exe');
  const batchPath = path.join(app.getPath('temp'), 'update.bat');

  // Create a batch script to handle the update
  const batchScript = `
    @echo off
    :check
    tasklist /FI "IMAGENAME eq ${path.basename(currentExePath)}" 2>NUL | find /I /N                     
    "${path.basename(currentExePath)}" >NUL
    if "%ERRORLEVEL%"=="0" (
    timeout /t 1
    goto :check
    )
    move /Y "${downloadPath}" "${currentExePath}"
    start "" "${currentExePath}"
    del "%~f0"
    `.trim();

  fs.writeFileSync(batchPath, batchScript);
  execSync(`start "" "${batchPath}"`);

  app.quit();
}

export async function checkForUpdates(
  mainWindow: BrowserWindow,
): Promise<void> {
  if (isDev) return;

  try {
    const latestRelease = await getLatestRelease();
    const latestVersion = latestRelease.tag_name.replace('v', '');
    const currentVersion = app.getVersion();

    if (!isNewerVersion(currentVersion, latestVersion)) return;

    await downloadAndInstallUpdate(latestRelease, mainWindow);
  } catch (err) {
    console.error('Error checking for updates:', err);
  }
}

async function getLatestRelease(): Promise<GithubRelease> {
  const response = await fetch(GITHUB_API_URL, {
    headers: {
      'User-Agent': 'DeskDetour-App',
    },
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  return response.json();
}

function isNewerVersion(current: string, latest: string): boolean {
  const currentParts = current.split('.').map(Number);
  const latestParts = latest.split('.').map(Number);

  for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
    const currentPart = currentParts[i] || 0;
    const latestPart = latestParts[i] || 0;

    if (latestPart > currentPart) return true;
    if (latestPart < currentPart) return false;
  }
  return false;
}

async function downloadAndInstallUpdate(
  release: GithubRelease,
  mainWindow: BrowserWindow,
): Promise<void> {
  try {
    const asset = findCompatibleAsset(release.assets);
    if (!asset)
      throw new Error(
        `No compatible version found for ${process.platform} ${getArch()}`,
      );

    const downloadPath = path.join(app.getPath('temp'), asset.name);
    await downloadFile(asset.browser_download_url, downloadPath);

    if (process.platform === 'darwin') {
      await installMacOSUpdate(downloadPath);
    } else if (process.platform === 'win32') {
      await installWindowsUpdate(downloadPath);
    }
  } catch (err) {
    await dialog.showMessageBox(mainWindow, {
      type: 'error',
      title: 'Update Error',
      message: 'Failed to update',
    });
    throw err;
  }
}

function findCompatibleAsset(assets: GithubRelease['assets']) {
  const assetPattern = getAssetPattern();
  return assets.find((asset) => {
    if (
      process.platform === 'win32' &&
      asset.name.toLowerCase().includes('setup')
    )
      return false;

    return assetPattern.test(asset.name);
  });
}

async function downloadFile(url: string, destination: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed: ${response.status}`);

  const body = response.body;
  if (!body) throw new Error('No response body');

  const fileStream = fs.createWriteStream(destination);

  try {
    await streamToFile(body, fileStream);
  } catch (err) {
    fileStream.destroy();
    fs.unlinkSync(destination);
    throw err;
  }
}

async function streamToFile(
  body: ReadableStream,
  fileStream: fs.WriteStream,
): Promise<void> {
  const reader = body.getReader();

  return new Promise((resolve, reject) => {
    fileStream.on('error', reject);

    async function pump(): Promise<void> {
      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            fileStream.end();
            break;
          }

          fileStream.write(value);
        }
        resolve();
      } catch (err) {
        reject(err);
      }
    }

    pump();
  });
}

export function initiateUpdateChecker(mainWindow: BrowserWindow): void {
  checkForUpdates(mainWindow);
  setInterval(() => checkForUpdates(mainWindow), CHECK_INTERVAL);
}
