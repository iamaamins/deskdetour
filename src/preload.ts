import { contextBridge, ipcRenderer } from 'electron';
import type { TimerState } from './types';

contextBridge.exposeInMainWorld('timer', {
  onUpdate: (callback: (state: TimerState) => void) => {
    let isSubscribed = true;
    const listener = (_: Electron.IpcRendererEvent, state: TimerState) =>
      callback(state);

    ipcRenderer.on('timer:update', listener);

    void ipcRenderer
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
  reset: () => ipcRenderer.invoke('timer:reset'),
  pause: () => ipcRenderer.invoke('timer:pause'),
  resume: () => ipcRenderer.invoke('timer:resume'),
});
