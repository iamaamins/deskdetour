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
      reset: () => Promise<void>;
      pause: () => Promise<void>;
      resume: () => Promise<void>;
    };
  }
}
