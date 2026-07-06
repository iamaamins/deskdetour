import { App, BrowserWindow, ipcMain, powerMonitor, Tray } from 'electron';
import {
  VIEW_TIME,
  IDLE_THRESHOLD,
  MOVE_TIME,
  WORK_TIME,
  SESSION_THRESHOLD,
} from './config';
import { formatTime, notify, playNotificationSound } from './utils';
import { NOTIFICATION } from './notification';
import { TimerState } from '../types';

let mainTimer: NodeJS.Timeout | null = null;
let idleTimer: NodeJS.Timeout | null = null;

const state: TimerState = {
  isIdle: false,
  isPaused: false,
  isViewTime: false,
  isMoveTime: false,
  sessionCount: 0,
  isWorkTime: true,
  timeRemaining: WORK_TIME,
};

function updateDisplays(
  mainWindow: BrowserWindow,
  tray: Tray,
  pauseReason: 'manual' | 'idle' | null,
) {
  if (pauseReason === 'manual') {
    tray.setTitle('Paused');
  } else if (pauseReason === 'idle') {
    tray.setTitle('Paused: Idle');
  } else {
    const minutes = Math.floor(state.timeRemaining / 60);
    const seconds = Math.floor(state.timeRemaining % 60);

    tray.setTitle(
      `${state.isWorkTime ? 'Work' : state.isViewTime ? 'View' : state.isMoveTime && 'Move'}: ${formatTime(
        minutes,
      )}:${formatTime(seconds)}`,
    );
  }

  mainWindow.webContents.send('timer:update', state);
}

export function pauseTimer() {
  state.isPaused = true;
}

export function resumeTimer() {
  state.isPaused = false;
}

export function startTimers(app: App, mainWindow: BrowserWindow, tray: Tray) {
  if (mainTimer) clearInterval(mainTimer);
  if (idleTimer) clearInterval(idleTimer);

  mainTimer = setInterval(() => {
    const pauseReason = state.isPaused
      ? 'manual'
      : state.isIdle
        ? 'idle'
        : null;

    if (!pauseReason) {
      state.timeRemaining--;

      if (state.timeRemaining <= 0) {
        if (state.isWorkTime) {
          notify(NOTIFICATION.view.title, NOTIFICATION.view.body);
          playNotificationSound(app, 'view');
          state.timeRemaining = VIEW_TIME;
          state.isViewTime = true;
          state.sessionCount++;
          state.isWorkTime = false;
        } else if (state.isViewTime) {
          if (state.sessionCount < SESSION_THRESHOLD) {
            notify(NOTIFICATION.work.title, NOTIFICATION.work.body);
            playNotificationSound(app, 'break-over');
            state.timeRemaining = WORK_TIME;
            state.isWorkTime = true;
          } else if (state.sessionCount >= SESSION_THRESHOLD) {
            notify(NOTIFICATION.move.title, NOTIFICATION.move.body);
            playNotificationSound(app, 'move');
            state.timeRemaining = MOVE_TIME;
            state.isMoveTime = true;
            state.sessionCount = 0;
          }

          state.isViewTime = false;
        } else if (state.isMoveTime) {
          notify(NOTIFICATION.work.title, NOTIFICATION.work.body);
          playNotificationSound(app, 'break-over');
          state.timeRemaining = WORK_TIME;
          state.isWorkTime = true;
          state.isMoveTime = false;
        }
      }
    }

    updateDisplays(mainWindow, tray, pauseReason);
  }, 1000);

  idleTimer = setInterval(() => {
    const idleTime = powerMonitor.getSystemIdleTime();
    state.isIdle = idleTime >= IDLE_THRESHOLD;
  }, 10 * 1000);
}

export function resetTimer() {
  state.isPaused = false;
  state.isViewTime = false;
  state.isMoveTime = false;
  state.sessionCount = 0;
  state.isWorkTime = true;
  state.timeRemaining = WORK_TIME;
}

export function stopTimers() {
  if (mainTimer) clearInterval(mainTimer);
  mainTimer = null;

  if (idleTimer) clearInterval(idleTimer);
  idleTimer = null;

  resetTimer();
}

export function handleEvents(app: App, mainWindow: BrowserWindow, tray: Tray) {
  ipcMain.handle('timer:reset', () => resetTimer());
  ipcMain.handle('timer:pause', () => {
    pauseTimer();
  });
  ipcMain.handle('timer:resume', () => {
    resumeTimer();
  });
  powerMonitor.on('lock-screen', () => stopTimers());
  powerMonitor.on('shutdown', () => stopTimers());
  powerMonitor.on('unlock-screen', () => startTimers(app, mainWindow, tray));
}
