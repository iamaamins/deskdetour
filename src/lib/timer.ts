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
import type { TimerState } from '../types';
import { assertTrustedSender } from './ipc';

type PauseReason = 'manual' | 'idle' | null;

let mainTimer: NodeJS.Timeout | null = null;
let idleTimer: NodeJS.Timeout | null = null;
let lastTrayTitle: string | null = null;
let lastStateSnapshot: string | null = null;

const state: TimerState = {
  isIdle: false,
  isPaused: false,
  isViewTime: false,
  isMoveTime: false,
  sessionCount: 0,
  isWorkTime: true,
  timeRemaining: WORK_TIME,
};

const getTimerState = () => ({ ...state });

const getPauseReason = (): PauseReason =>
  state.isPaused ? 'manual' : state.isIdle ? 'idle' : null;

function getTrayTitle(pauseReason: PauseReason) {
  if (pauseReason === 'manual') return 'Paused';
  if (pauseReason === 'idle') return 'Idle';

  const minutes = Math.floor(state.timeRemaining / 60);
  const seconds = Math.floor(state.timeRemaining % 60);
  const phase = state.isWorkTime ? 'Work' : state.isViewTime ? 'View' : 'Move';

  return `${phase}: ${formatTime(minutes)}:${formatTime(seconds)}`;
}

function updateDisplays(
  mainWindow: BrowserWindow,
  tray: Tray,
  pauseReason: PauseReason,
) {
  const trayTitle = getTrayTitle(pauseReason);

  if (trayTitle !== lastTrayTitle) {
    tray.setTitle(trayTitle);
    lastTrayTitle = trayTitle;
  }

  const nextState = getTimerState();
  const nextStateSnapshot = JSON.stringify(nextState);

  if (nextStateSnapshot !== lastStateSnapshot) {
    mainWindow.webContents.send('timer:update', nextState);
    lastStateSnapshot = nextStateSnapshot;
  }
}

export const isTimerPaused = () => state.isPaused;
export const isTimerIdle = () => state.isIdle;

export function pauseTimer() {
  if (state.isIdle) return;
  state.isPaused = true;
}

export function resumeTimer() {
  if (state.isIdle) return;
  state.isPaused = false;
}

export function startTimers(
  app: App,
  mainWindow: BrowserWindow,
  tray: Tray,
  updateTrayMenu: () => void,
) {
  if (mainTimer) clearInterval(mainTimer);
  if (idleTimer) clearInterval(idleTimer);

  mainTimer = setInterval(() => {
    const pauseReason = getPauseReason();

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
          } else {
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
    if (state.isPaused) return;

    const isIdle = powerMonitor.getSystemIdleTime() >= IDLE_THRESHOLD;

    if (isIdle !== state.isIdle) {
      state.isIdle = isIdle;
      updateTrayMenu();
    }
  }, 10 * 1000);
}

export function resetTimer() {
  state.isIdle = false;
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

export function handleEvents(
  app: App,
  mainWindow: BrowserWindow,
  tray: Tray,
  updateTrayMenu: () => void,
) {
  ipcMain.handle('timer:get-state', (event) => {
    assertTrustedSender(event, mainWindow);
    return getTimerState();
  });
  ipcMain.handle('timer:reset', (event) => {
    assertTrustedSender(event, mainWindow);
    resetTimer();
    updateTrayMenu();
  });
  ipcMain.handle('timer:pause', (event) => {
    assertTrustedSender(event, mainWindow);
    pauseTimer();
    updateTrayMenu();
  });
  ipcMain.handle('timer:resume', (event) => {
    assertTrustedSender(event, mainWindow);
    resumeTimer();
    updateTrayMenu();
  });
  powerMonitor.on('lock-screen', () => {
    stopTimers();
    updateTrayMenu();
  });
  powerMonitor.on('shutdown', stopTimers);
  powerMonitor.on('unlock-screen', () => {
    startTimers(app, mainWindow, tray, updateTrayMenu);
    updateTrayMenu();
  });
}
