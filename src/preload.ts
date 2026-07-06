import { contextBridge, ipcRenderer } from 'electron';
import { TimerState } from './types';

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
