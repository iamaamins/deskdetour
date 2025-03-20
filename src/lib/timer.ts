import {
  BrowserWindow,
  ipcMain,
  Notification,
  powerMonitor,
  Tray,
} from 'electron';
import {
  VIEW_TIME,
  IDLE_THRESHOLD,
  MOVE_TIME,
  WORK_TIME,
  SESSION_THRESHOLD,
} from './config';

let mainTimer: NodeJS.Timeout | null = null;
let idleTimer: NodeJS.Timeout | null = null;
const state = {
  isPaused: false,
  isViewTime: false,
  isMoveTime: false,
  sessionCount: 0,
  timeRemaining: WORK_TIME,
};

// Utils
const notify = (title: string, body: string) =>
  new Notification({ title, body }).show();

const formatTime = (time: number) => time.toString().padStart(2, '0');

// Start the timers
export function startTimers(mainWindow: BrowserWindow, tray: Tray) {
  if (mainTimer) clearInterval(mainTimer);
  if (idleTimer) clearInterval(idleTimer);

  mainTimer = setInterval(() => {
    if (state.isPaused) return;

    state.timeRemaining--;

    if (state.timeRemaining <= 0) {
      if (state.isViewTime) {
        notify(
          'Work Time!',
          `Back to work! Next break in ${WORK_TIME / 60} minutes`,
        );
        state.timeRemaining = WORK_TIME;
        state.isViewTime = false;

        if (state.sessionCount >= SESSION_THRESHOLD) {
          state.isMoveTime = true;
          state.timeRemaining = MOVE_TIME;
          notify('Move Time!', `Move/exercise for ${MOVE_TIME / 60} minutes`);
          state.sessionCount = 0;
        }
      } else if (state.isMoveTime) {
        notify(
          'Work Time!',
          `Back to work! Next break in ${WORK_TIME / 60} minutes`,
        );
        state.timeRemaining = WORK_TIME;
        state.isMoveTime = false;
      } else {
        notify('Break Time!', `Look 20 feet further for ${VIEW_TIME} seconds`);
        state.timeRemaining = VIEW_TIME;
        state.isViewTime = true;
        state.sessionCount++;
      }
    }

    const minutes = Math.floor(state.timeRemaining / 60);
    const seconds = Math.floor(state.timeRemaining % 60);
    tray.setTitle(
      `${state.isViewTime ? 'View' : state.isMoveTime ? 'Move' : 'Work'}: ${formatTime(
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
  state.timeRemaining = WORK_TIME;
}

export function handleEvents(mainWindow: BrowserWindow, tray: Tray) {
  ipcMain.handle('timer:reset', () => resetMainTimer());
  powerMonitor.on('lock-screen', () => stopTimers());
  powerMonitor.on('shutdown', () => stopTimers());
  powerMonitor.on('unlock-screen', () => startTimers(mainWindow, tray));
}
