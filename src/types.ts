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

export type LaunchAtLoginSettings = {
  openAtLogin: boolean;
  isSupported: boolean;
  status?: 'not-registered' | 'enabled' | 'requires-approval' | 'not-found';
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
    settings: {
      getLaunchAtLogin: () => Promise<LaunchAtLoginSettings>;
      setLaunchAtLogin: (
        openAtLogin: boolean,
      ) => Promise<LaunchAtLoginSettings>;
    };
  }
}

export type NotificationTitle =
  (typeof NOTIFICATION)[keyof typeof NOTIFICATION]['title'];
export type NotificationBody =
  (typeof NOTIFICATION)[keyof typeof NOTIFICATION]['body'];
