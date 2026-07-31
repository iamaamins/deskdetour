export const WORK_TIME = 15 * 60;
export const VIEW_TIME = 20;
export const SHORT_MOVE_TIME = 2.5 * 60;
export const LONG_MOVE_TIME = 5 * 60;
export const IDLE_THRESHOLD = 7.5 * 60;
export const SESSION_THRESHOLD = 2;

export const isMac = process.platform === 'darwin';
export const isWin = process.platform === 'win32';
export const isDev = process.env.NODE_ENV === 'development';
