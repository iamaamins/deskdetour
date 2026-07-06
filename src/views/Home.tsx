import { useEffect, useState } from 'react';
import { TimerState } from '../types';
import {
  IoArrowForwardOutline,
  IoDesktopOutline,
  IoEyeOutline,
  IoFitnessOutline,
  IoPauseOutline,
  IoPlayOutline,
  IoRefreshOutline,
} from 'react-icons/io5';
import { Link } from 'react-router';

const PHASE_LENGTHS = {
  work: 15 * 60,
  view: 20,
  move: 2 * 60,
} as const;

export default function Home() {
  const [timer, setTimer] = useState<TimerState | null>(null);

  useEffect(() => {
    return window.timer.onUpdate((state) => setTimer(state));
  }, []);

  const isViewTimeComingUp = (timer: TimerState) => timer.isWorkTime;

  const isWorkTimeComingUp = (timer: TimerState) =>
    (timer.isViewTime || timer.isMoveTime) && timer.sessionCount < 2;

  const remainingSessionCount = (timer: TimerState) => 2 - timer.sessionCount;

  if (!timer) {
    return (
      <main className='page home-page'>
        <div className='loading-state'>
          <span className='loading-pulse' />
          <p>Starting your timer…</p>
        </div>
      </main>
    );
  }

  const phase = timer.isViewTime
    ? {
        key: 'view' as const,
        label: 'View break',
        helper: 'Look at something 20 feet away',
        icon: IoEyeOutline,
      }
    : timer.isMoveTime
      ? {
          key: 'move' as const,
          label: 'Move break',
          helper: 'Stand up and move a little',
          icon: IoFitnessOutline,
        }
      : {
          key: 'work' as const,
          label: 'Focus time',
          helper: 'Stay with the task at hand',
          icon: IoDesktopOutline,
        };

  const PhaseIcon = phase.icon;
  const progress = Math.max(
    0,
    Math.min(1, timer.timeRemaining / PHASE_LENGTHS[phase.key]),
  );
  const progressOffset = 603.19 * (1 - progress);
  const minutes = Math.floor(timer.timeRemaining / 60);
  const seconds = Math.floor(timer.timeRemaining % 60)
    .toString()
    .padStart(2, '0');
  const isPaused = timer.isPaused || timer.isIdle;
  const nextLabel = isViewTimeComingUp(timer)
    ? 'View break'
    : isWorkTimeComingUp(timer)
      ? 'Focus time'
      : 'Move break';
  const NextIcon = isViewTimeComingUp(timer)
    ? IoEyeOutline
    : isWorkTimeComingUp(timer)
      ? IoDesktopOutline
      : IoFitnessOutline;

  return (
    <main className='page home-page'>
      <header className='page-header'>
        <div>
          <p className='eyebrow'>Today's rhythm</p>
          <h1>Take care of your health.</h1>
        </div>
        <div className={`live-badge${isPaused ? 'is-paused' : ''}`}>
          <span />
          {isPaused ? (timer.isIdle ? 'Paused · Idle' : 'Paused') : 'Active'}
        </div>
      </header>

      <section className='dashboard'>
        <div className='timer-card'>
          <div className='phase-label'>
            <span className={`phase-icon phase-${phase.key}`}>
              <PhaseIcon aria-hidden='true' />
            </span>
            <div>
              <strong>{isPaused ? 'Timer paused' : phase.label}</strong>
              <span>{phase.helper}</span>
            </div>
          </div>

          <div className='timer-ring'>
            <svg viewBox='0 0 216 216' aria-hidden='true'>
              <circle className='timer-track' cx='108' cy='108' r='96' />
              <circle
                className={`timer-progress timer-progress-${phase.key}`}
                cx='108'
                cy='108'
                r='96'
                style={{ strokeDashoffset: progressOffset }}
              />
            </svg>
            <div className='timer-value' aria-label={`${minutes}:${seconds}`}>
              <span>
                {minutes}:{seconds}
              </span>
              <small>remaining</small>
            </div>
          </div>

          <div className='timer-actions'>
            <button
              onClick={() => window.timer.reset()}
              className='button button-secondary'
            >
              <IoRefreshOutline aria-hidden='true' /> Reset
            </button>
            {isPaused && !timer.isIdle ? (
              <button
                onClick={() => window.timer.resume()}
                className='button button-primary'
              >
                <IoPlayOutline aria-hidden='true' /> Resume
              </button>
            ) : (
              <button
                onClick={() => window.timer.pause()}
                className='button button-primary'
                disabled={timer.isIdle}
              >
                <IoPauseOutline aria-hidden='true' /> Pause
              </button>
            )}
          </div>
        </div>

        <div className='dashboard-side'>
          <article className='info-card next-card'>
            <p className='card-label'>Coming up</p>
            <div className='next-session'>
              <span className='next-icon'>
                <NextIcon aria-hidden='true' />
              </span>
              <div>
                <strong>{nextLabel}</strong>
                <span>After this timer</span>
              </div>
            </div>
          </article>

          <article className='info-card cycle-card'>
            <p className='card-label'>Movement cycle</p>
            <div
              className='cycle-progress'
              aria-label='Work sessions completed'
            >
              {[0, 1].map((session) => (
                <span
                  key={session}
                  className={session < timer.sessionCount ? 'complete' : ''}
                />
              ))}
              <span className='cycle-finish'>
                <IoFitnessOutline aria-hidden='true' />
              </span>
            </div>
            <p>
              <strong>{Math.max(0, remainingSessionCount(timer))}</strong>{' '}
              {remainingSessionCount(timer) === 1 ? 'session' : 'sessions'}{' '}
              until your movement break.
            </p>
            <Link to='/exercises' className='text-link'>
              Plan your break <IoArrowForwardOutline aria-hidden='true' />
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
