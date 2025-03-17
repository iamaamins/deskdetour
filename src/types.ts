export type TimerState = {
  timeRemaining: number;
  isViewTime: boolean;
  isMoveTime: boolean;
  isPaused: boolean;
};

declare global {
  interface Window {
    timer: {
      onUpdate: (callback: (state: TimerState) => void) => void;
      reset: () => void;
    };
  }
}
