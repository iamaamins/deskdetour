import { App, BrowserWindow, ipcMain, powerMonitor, Tray } from 'electron';
import {
  VIEW_TIME,
  IDLE_THRESHOLD,
  MOVE_TIME,
  WORK_TIME,
  SESSION_THRESHOLD,
} from './config';
import { formatTime, notify, playNotificationSound } from './utils';

let mainTimer: NodeJS.Timeout | null = null;
let idleTimer: NodeJS.Timeout | null = null;
const state = {
  isPaused: false,
  isViewTime: false,
  isMoveTime: false,
  sessionCount: 0,
  isWorkTime: true,
  timeRemaining: WORK_TIME,
};

// Start the timers
export function startTimers(app: App, mainWindow: BrowserWindow, tray: Tray) {
  if (mainTimer) clearInterval(mainTimer);
  if (idleTimer) clearInterval(idleTimer);

  mainTimer = setInterval(() => {
    if (state.isPaused) return;

    state.timeRemaining--;

    if (state.timeRemaining <= 0) {
      if (state.isWorkTime) {
        notify('View Time!', `Look 20 feet further for ${VIEW_TIME} seconds`);
        playNotificationSound(app, 'view');
        state.timeRemaining = VIEW_TIME;
        state.isViewTime = true;
        state.sessionCount++;
        state.isWorkTime = false;
      } else if (state.isViewTime) {
        if (state.sessionCount < SESSION_THRESHOLD) {
          notify(
            'Work Time!',
            `Back to work! Next break in ${WORK_TIME / 60} minutes`,
          );
          state.timeRemaining = WORK_TIME;
          state.isWorkTime = true;
        } else if (state.sessionCount >= SESSION_THRESHOLD) {
          notify('Move Time!', `Move/exercise for ${MOVE_TIME / 60} minutes`);
          playNotificationSound(app, 'move');
          state.timeRemaining = MOVE_TIME;
          state.isMoveTime = true;
          state.sessionCount = 0;
        }

        state.isViewTime = false;
      } else if (state.isMoveTime) {
        notify(
          'Work Time!',
          `Back to work! Next break in ${WORK_TIME / 60} minutes`,
        );
        state.timeRemaining = WORK_TIME;
        state.isWorkTime = true;
        state.isMoveTime = false;
      }
    }

    const minutes = Math.floor(state.timeRemaining / 60);
    const seconds = Math.floor(state.timeRemaining % 60);
    tray.setTitle(
      `${state.isWorkTime ? 'Work' : state.isViewTime ? 'View' : state.isMoveTime && 'Move'}: ${formatTime(
        minutes,
      )}:${formatTime(seconds)}`,
    );

    mainWindow.webContents.send('timer:update', state);
  }, 1000);

  idleTimer = setInterval(() => {
    const idleTime = powerMonitor.getSystemIdleTime();
    if (idleTime >= IDLE_THRESHOLD && !state.isPaused) state.isPaused = true;
    if (idleTime < IDLE_THRESHOLD && state.isPaused) state.isPaused = false;
  }, 10 * 1000);
}

export function stopTimers() {
  if (mainTimer) clearInterval(mainTimer);
  mainTimer = null;

  if (idleTimer) clearInterval(idleTimer);
  idleTimer = null;

  resetMainTimer();
}

export function resetMainTimer() {
  state.isPaused = false;
  state.isViewTime = false;
  state.isMoveTime = false;
  state.sessionCount = 0;
  state.isWorkTime = true;
  state.timeRemaining = WORK_TIME;
}

export function handleEvents(app: App, mainWindow: BrowserWindow, tray: Tray) {
  ipcMain.handle('timer:reset', () => resetMainTimer());
  powerMonitor.on('lock-screen', () => stopTimers());
  powerMonitor.on('shutdown', () => stopTimers());
  powerMonitor.on('unlock-screen', () => startTimers(app, mainWindow, tray));
}
