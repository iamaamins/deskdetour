export const WORK_TIME = 1 * 60;
export const VIEW_TIME = 20;
export const MOVE_TIME = 0.5 * 60;
export const IDLE_THRESHOLD = 5 * 60;
export const SESSION_THRESHOLD = 3;

export const isMac = process.platform === 'darwin';
export const isDev = process.env.NODE_ENV === 'development';
