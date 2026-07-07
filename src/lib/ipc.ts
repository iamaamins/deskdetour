import { BrowserWindow, IpcMainInvokeEvent } from 'electron';

export function assertTrustedSender(
  event: IpcMainInvokeEvent,
  mainWindow: BrowserWindow,
) {
  if (
    mainWindow.isDestroyed() ||
    event.sender.id !== mainWindow.webContents.id
  ) {
    throw new Error('Rejected IPC call from an untrusted sender.');
  }
}
