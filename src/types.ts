import { NOTIFICATION } from './lib/notification';

export type TimerState = {
  isIdle: boolean;
  isPaused: boolean;
  isWorkTime: boolean;
  isViewTime: boolean;
  isMoveTime: boolean;
  timeRemaining: number;
  sessionCount: number;
};

declare global {
  interface Window {
    timer: {
      onUpdate: (callback: (state: TimerState) => void) => () => void;
      getState: () => Promise<TimerState>;
      reset: () => Promise<void>;
      pause: () => Promise<void>;
      resume: () => Promise<void>;
    };
  }
}

export type NotificationTitle =
  (typeof NOTIFICATION)[keyof typeof NOTIFICATION]['title'];
export type NotificationBody =
  (typeof NOTIFICATION)[keyof typeof NOTIFICATION]['body'];
