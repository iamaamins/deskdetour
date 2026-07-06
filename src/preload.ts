import { contextBridge, ipcRenderer } from 'electron';
import { PauseDuration, TimerState } from './types';

contextBridge.exposeInMainWorld('timer', {
  onUpdate: (callback: (state: TimerState) => void) => {
    const listener = (_: Electron.IpcRendererEvent, state: TimerState) =>
      callback(state);
    ipcRenderer.on('timer:update', listener);
    return () => ipcRenderer.removeListener('timer:update', listener);
  },
  reset: () => ipcRenderer.invoke('timer:reset'),
  pause: (minutes: PauseDuration) => ipcRenderer.invoke('timer:pause', minutes),
  resume: () => ipcRenderer.invoke('timer:resume'),
});
