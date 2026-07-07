import { contextBridge, ipcRenderer } from 'electron';
import { LaunchAtLoginSettings, TimerState } from './types';

contextBridge.exposeInMainWorld('timer', {
  onUpdate: (callback: (state: TimerState) => void) => {
    let isSubscribed = true;
    const listener = (_: Electron.IpcRendererEvent, state: TimerState) =>
      callback(state);
    ipcRenderer.on('timer:update', listener);
    ipcRenderer
      .invoke('timer:get-state')
      .then((state: TimerState) => {
        if (isSubscribed) callback(state);
      })
      .catch((error) => {
        console.error('Failed to load initial timer state.', error);
      });
    return () => {
      isSubscribed = false;
      ipcRenderer.removeListener('timer:update', listener);
    };
  },
  getState: (): Promise<TimerState> => ipcRenderer.invoke('timer:get-state'),
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
