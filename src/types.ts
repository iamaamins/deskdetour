import { NOTIFICATION } from './lib/notification';

export type TimerState = {
  isIdle: boolean;
  pauseUntil: number | null;
  isWorkTime: boolean;
  isViewTime: boolean;
  isMoveTime: boolean;
  timeRemaining: number;
  sessionCount: number;
};

export type PauseDuration = 45 | 120;

declare global {
  interface Window {
    timer: {
      onUpdate: (callback: (state: TimerState) => void) => () => void;
      reset: () => Promise<void>;
      pause: (minutes: PauseDuration) => Promise<void>;
      resume: () => Promise<void>;
    };
  }
}

export type NotificationTitle =
  (typeof NOTIFICATION)[keyof typeof NOTIFICATION]['title'];
export type NotificationBody =
  (typeof NOTIFICATION)[keyof typeof NOTIFICATION]['body'];
