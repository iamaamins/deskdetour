import { contextBridge, ipcRenderer } from 'electron';
import { LaunchAtLoginSettings, TimerState } from './types';

contextBridge.exposeInMainWorld('timer', {
  onUpdate: (callback: (state: TimerState) => void) => {
    const listener = (_: Electron.IpcRendererEvent, state: TimerState) =>
      callback(state);
    ipcRenderer.on('timer:update', listener);
    return () => ipcRenderer.removeListener('timer:update', listener);
  },
  reset: () => ipcRenderer.invoke('timer:reset'),
  pause: () => ipcRenderer.invoke('timer:pause'),
  resume: () => ipcRenderer.invoke('timer:resume'),
});

contextBridge.exposeInMainWorld('settings', {
  getLaunchAtLogin: (): Promise<LaunchAtLoginSettings> =>
    ipcRenderer.invoke('settings:get-launch-at-login'),
  setLaunchAtLogin: (openAtLogin: boolean): Promise<LaunchAtLoginSettings> =>
    ipcRenderer.invoke('settings:set-launch-at-login', openAtLogin),
});
