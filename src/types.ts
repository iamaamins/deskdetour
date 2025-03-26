export type TimerState = {
  isPaused: boolean;
  isWorkTime: boolean;
  isViewTime: boolean;
  isMoveTime: boolean;
  timeRemaining: number;
};

declare global {
  interface Window {
    timer: {
      onUpdate: (callback: (state: TimerState) => void) => void;
      reset: () => void;
    };
  }
}
