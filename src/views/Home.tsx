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

const PHASE_LENGTHS = { work: 15 * 60, view: 20 } as const;

export default function Home() {
  const [timer, setTimer] = useState<TimerState | null>(null);
  const currentDate = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  useEffect(() => {
    return window.timer.onUpdate((state) => setTimer(state));
  }, []);

  const isViewTimeComingUp = (timer: TimerState) => timer.isWorkTime;

  const isWorkTimeComingUp = (timer: TimerState) =>
    (timer.isViewTime || timer.isMoveTime) && timer.sessionCount < 2;

  const remainingSessionCount = (timer: TimerState) => 2 - timer.sessionCount;

  if (!timer) {
    return (
      <main className='h-full px-9 pt-[34px] pb-7'>
        <div className='flex h-full flex-col items-center justify-center gap-3 text-[13px] text-[var(--muted)]'>
          <span className='size-[30px] animate-spin rounded-full border-[3px] border-[#dbe6de] border-t-[var(--primary)]' />
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
          label: 'Work time',
          helper: 'Stay with the task at hand',
          icon: IoDesktopOutline,
        };

  const PhaseIcon = phase.icon;
  const phaseLength =
    phase.key === 'move'
      ? timer.isLongMoveBreaksEnabled
        ? 5 * 60
        : 2.5 * 60
      : PHASE_LENGTHS[phase.key];
  const progress = Math.max(0, Math.min(1, timer.timeRemaining / phaseLength));
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
    <main className='h-full px-9 pt-[34px] pb-7'>
      <header className='flex min-h-[67px] items-start justify-between'>
        <div>
          <p className='mb-1 text-[11px] font-[750] text-[var(--primary)] uppercase'>
            {currentDate}
          </p>
          <h1 className='text-[27px] leading-[1.15] font-[650]'>
            Build healthy habits.
          </h1>
        </div>
        <div
          className={
            isPaused
              ? 'mt-1.5 flex items-center gap-[7px] rounded-full border border-[#eadfcf] bg-[rgba(250,252,249,0.78)] px-[11px] py-[7px] text-[11.5px] font-[650] text-[#8b693b]'
              : 'mt-1.5 flex items-center gap-[7px] rounded-full border border-[#dce8e0] bg-[rgba(250,252,249,0.78)] px-[11px] py-[7px] text-[11.5px] font-[650] text-[#377556]'
          }
        >
          <span
            className={
              isPaused
                ? 'size-1.5 rounded-full bg-[var(--warm)] shadow-[0_0_0_3px_rgba(217,152,66,0.13)]'
                : 'size-1.5 rounded-full bg-[#4c9b71] shadow-[0_0_0_3px_rgba(76,155,113,0.12)]'
            }
          />
          {isPaused ? (timer.isIdle ? 'Paused · Idle' : 'Paused') : 'Active'}
        </div>
      </header>

      <section className='grid h-[calc(100%_-_75px)] min-h-[400px] grid-cols-[minmax(0,1.42fr)_minmax(190px,0.9fr)] gap-3.5'>
        <div className='flex min-w-0 flex-col items-center rounded-[22px] border border-[rgba(223,228,223,0.92)] bg-[rgba(255,255,255,0.88)] px-5 pt-5 pb-[18px] shadow-[0_18px_50px_rgba(36,52,43,0.08)]'>
          <div className='flex w-full items-center gap-2.5'>
            <span
              className={
                phase.key === 'view'
                  ? 'grid size-[37px] shrink-0 place-items-center rounded-[11px] bg-[var(--warm-soft)] text-[#a0692c] [&_svg]:size-[18px]'
                  : phase.key === 'move'
                    ? 'grid size-[37px] shrink-0 place-items-center rounded-[11px] bg-[#e7edf4] text-[#506d8c] [&_svg]:size-[18px]'
                    : 'grid size-[37px] shrink-0 place-items-center rounded-[11px] bg-[var(--primary-soft)] text-[var(--primary)] [&_svg]:size-[18px]'
              }
            >
              <PhaseIcon aria-hidden='true' />
            </span>
            <div className='flex flex-col'>
              <strong className='text-sm font-[650]'>
                {isPaused ? 'Timer paused' : phase.label}
              </strong>
              <span className='text-[11.5px] text-[var(--muted)]'>
                {phase.helper}
              </span>
            </div>
          </div>

          <div className='relative my-auto h-[min(244px,35vh)] w-[min(244px,35vh)]'>
            <svg
              className='size-full -rotate-90'
              viewBox='0 0 216 216'
              aria-hidden='true'
            >
              <circle
                className='fill-none stroke-[#edf0ec] [stroke-width:8]'
                cx='108'
                cy='108'
                r='96'
              />
              <circle
                className={
                  phase.key === 'view'
                    ? 'fill-none stroke-[var(--warm)] [stroke-width:8] transition-[stroke-dashoffset] duration-700 ease-linear [stroke-dasharray:603.19] [stroke-linecap:round]'
                    : phase.key === 'move'
                      ? 'fill-none stroke-[#6684a5] [stroke-width:8] transition-[stroke-dashoffset] duration-700 ease-linear [stroke-dasharray:603.19] [stroke-linecap:round]'
                      : 'fill-none stroke-[var(--primary)] [stroke-width:8] transition-[stroke-dashoffset] duration-700 ease-linear [stroke-dasharray:603.19] [stroke-linecap:round]'
                }
                cx='108'
                cy='108'
                r='96'
                style={{ strokeDashoffset: progressOffset }}
              />
            </svg>
            <div
              className='absolute inset-0 flex flex-col items-center justify-center'
              aria-label={`${minutes}:${seconds}`}
            >
              <span className='text-[clamp(48px,8vh,64px)] leading-none font-[580] [font-variant-numeric:tabular-nums]'>
                {minutes}:{seconds}
              </span>
              <small className='mt-[7px] text-[10px] font-bold text-[var(--muted)] uppercase'>
                remaining
              </small>
            </div>
          </div>

          <div className='flex justify-center gap-2'>
            <button
              onClick={() => window.timer.reset()}
              className='inline-flex h-10 min-w-[98px] cursor-pointer items-center justify-center gap-[7px] rounded-[10px] border-0 bg-[#edf0ec] text-[13px] font-[650] text-[var(--ink)] transition-[transform,background,box-shadow] duration-150 hover:-translate-y-px hover:bg-[#e5e9e4] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-[0.55] disabled:hover:translate-y-0 [&_svg]:size-4'
            >
              <IoRefreshOutline aria-hidden='true' /> Reset
            </button>
            {isPaused && !timer.isIdle ? (
              <button
                onClick={() => window.timer.resume()}
                className='inline-flex h-10 min-w-[98px] cursor-pointer items-center justify-center gap-[7px] rounded-[10px] border-0 bg-[var(--ink)] text-[13px] font-[650] text-white shadow-[0_7px_16px_rgba(23,34,29,0.16)] transition-[transform,background,box-shadow] duration-150 hover:-translate-y-px hover:bg-[#29362f] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-[0.55] disabled:hover:translate-y-0 [&_svg]:size-4'
              >
                <IoPlayOutline aria-hidden='true' /> Resume
              </button>
            ) : (
              <button
                onClick={() => window.timer.pause()}
                className='inline-flex h-10 min-w-[98px] cursor-pointer items-center justify-center gap-[7px] rounded-[10px] border-0 bg-[var(--ink)] text-[13px] font-[650] text-white shadow-[0_7px_16px_rgba(23,34,29,0.16)] transition-[transform,background,box-shadow] duration-150 hover:-translate-y-px hover:bg-[#29362f] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-[0.55] disabled:hover:translate-y-0 [&_svg]:size-4'
                disabled={timer.isIdle}
              >
                <IoPauseOutline aria-hidden='true' /> Pause
              </button>
            )}
          </div>
        </div>

        <div className='flex min-w-0 flex-col gap-3'>
          <article className='flex-none rounded-[17px] border border-[rgba(223,228,223,0.92)] bg-[rgba(255,255,255,0.88)] p-[18px] shadow-[0_18px_50px_rgba(36,52,43,0.08)]'>
            <p className='mb-1 text-[11px] font-[750] text-[var(--primary)] uppercase'>
              Coming up
            </p>
            <div className='mt-3 flex items-center gap-2.5'>
              <span className='grid size-[41px] shrink-0 place-items-center rounded-xl bg-[var(--warm-soft)] text-[#9b652d] [&_svg]:size-[19px]'>
                <NextIcon aria-hidden='true' />
              </span>
              <div className='flex flex-col'>
                <strong className='text-sm font-[650]'>{nextLabel}</strong>
                <span className='text-[11.5px] text-[var(--muted)]'>
                  After this session
                </span>
              </div>
            </div>
          </article>

          <article className='flex-1 rounded-[17px] border border-[rgba(223,228,223,0.92)] bg-[rgba(255,255,255,0.88)] p-[18px] shadow-[0_18px_50px_rgba(36,52,43,0.08)]'>
            <p className='mb-1 text-[11px] font-[750] text-[var(--primary)] uppercase'>
              Movement cycle
            </p>
            <div
              className='my-[17px] mb-3.5 grid grid-cols-[1fr_1fr_30px] items-center gap-[7px]'
              aria-label='Work sessions completed'
            >
              {[0, 1].map((session) => (
                <span
                  key={session}
                  className={
                    session < timer.sessionCount
                      ? 'h-[5px] rounded-full bg-[var(--primary)]'
                      : 'h-[5px] rounded-full bg-[#e7ebe6]'
                  }
                />
              ))}
              <span className='grid size-[27px] place-items-center rounded-[9px] bg-[var(--primary-soft)] text-[var(--primary)] [&_svg]:size-3.5'>
                <IoFitnessOutline aria-hidden='true' />
              </span>
            </div>
            <p className='text-[12.5px] leading-[1.45] text-[var(--muted-strong)]'>
              <strong className='text-base text-[var(--ink)]'>
                {Math.max(0, remainingSessionCount(timer))}
              </strong>{' '}
              {remainingSessionCount(timer) === 1 ? 'session' : 'sessions'}{' '}
              until your movement break.
            </p>
            <Link
              to='/exercises'
              className='mt-3.5 inline-flex items-center gap-[5px] text-xs font-bold text-[var(--primary)] [&_svg]:transition-transform hover:[&_svg]:translate-x-0.5'
            >
              Plan your break <IoArrowForwardOutline aria-hidden='true' />
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
