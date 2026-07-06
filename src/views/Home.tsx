import { useEffect, useState } from 'react';
import { PauseDuration, TimerState } from '../types';
import { RiResetLeftLine } from 'react-icons/ri';
import {
  IoDesktopOutline,
  IoEyeOutline,
  IoPauseOutline,
  IoPlayOutline,
} from 'react-icons/io5';
import { Link } from 'react-router';
import { MdOutlineSportsGymnastics } from 'react-icons/md';
import { BiCoffeeTogo } from 'react-icons/bi';

type PauseOption = { label: string; minutes: PauseDuration };

const PAUSE_OPTIONS: PauseOption[] = [
  { label: '45m', minutes: 45 },
  { label: '2h', minutes: 120 },
];

export default function Home() {
  const [timer, setTimer] = useState<TimerState | null>(null);

  useEffect(() => {
    return window.timer.onUpdate((state) => setTimer(state));
  }, []);

  const isViewTimeComingUp = (timer: TimerState) => timer.isWorkTime;

  const isWorkTimeComingUp = (timer: TimerState) =>
    (timer.isViewTime || timer.isMoveTime) && timer.sessionCount < 2;

  const isMoveTimeComingUp = (timer: TimerState) =>
    timer.isViewTime && timer.sessionCount >= 2;

  const remainingSessionCount = (timer: TimerState) => 2 - timer.sessionCount;

  const pauseUntil = !timer?.pauseUntil
    ? 0
    : Math.max(0, Math.ceil((timer.pauseUntil - Date.now()) / 1000));

  const pauseReason = pauseUntil ? 'manual' : timer?.isIdle ? 'idle' : null;

  const displayedTime =
    pauseReason === 'manual' ? pauseUntil : timer?.timeRemaining || 0;

  return (
    <main className='mx-auto w-xl'>
      {timer && (
        <section className='flex h-screen flex-col items-center justify-center gap-2'>
          <p className='text-2xl font-medium'>
            {pauseReason === 'manual' || pauseReason === 'idle'
              ? 'Paused'
              : timer.isWorkTime
                ? 'Work'
                : timer.isViewTime
                  ? 'View'
                  : timer.isMoveTime && 'Move'}
          </p>
          <div className='flex items-center text-9xl font-bold'>
            <p>{Math.floor(displayedTime / 60)}</p>
            <span>:</span>
            <p>
              {Math.floor(displayedTime % 60)
                .toString()
                .padStart(2, '0')}
            </p>
          </div>
          <div className='flex items-center gap-2'>
            {pauseReason === 'manual' ? (
              <button
                onClick={() => window.timer.resume()}
                className='bg-yellow text-white-black-scheme flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2'
              >
                <IoPlayOutline /> Resume
              </button>
            ) : pauseReason === null ? (
              <>
                <button
                  onClick={() => window.timer.reset()}
                  className='bg-slight-gray flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2'
                >
                  <RiResetLeftLine /> Reset
                </button>
                {PAUSE_OPTIONS.map(({ label, minutes }) => (
                  <button
                    key={minutes}
                    onClick={() => window.timer.pause(minutes)}
                    className='bg-slight-gray flex cursor-pointer items-center justify-center gap-2 rounded-full px-3 py-2'
                    aria-label={`Pause reminders for ${minutes} minutes`}
                  >
                    <IoPauseOutline /> Pause {label}
                  </button>
                ))}
              </>
            ) : null}
          </div>
          <div className='border-slight-gray mt-2 space-y-2 rounded-xl border p-4'>
            <p className='text-lg font-medium'>Coming up:</p>
            <div className='flex items-center gap-4'>
              <p className='flex items-center gap-1.5'>
                <span className='border-green bg-green/50 flex h-6 w-6 items-center justify-center rounded-md border p-1'>
                  {isViewTimeComingUp(timer) ? (
                    <IoEyeOutline />
                  ) : isWorkTimeComingUp(timer) ? (
                    <IoDesktopOutline />
                  ) : (
                    isMoveTimeComingUp(timer) && <MdOutlineSportsGymnastics />
                  )}
                </span>
                <span>
                  {isViewTimeComingUp(timer)
                    ? 'View'
                    : isWorkTimeComingUp(timer)
                      ? 'Work'
                      : isMoveTimeComingUp(timer) && 'Move'}{' '}
                  session
                </span>
              </p>
              <p className='flex items-center gap-1.5'>
                <span className='border-green bg-green/50 flex h-6 w-6 items-center justify-center rounded-md border p-1 font-bold'>
                  {remainingSessionCount(timer)}
                </span>
                <span>
                  {remainingSessionCount(timer) > 1 ? 'sessions' : 'session'}{' '}
                  before{' '}
                  <Link className='text-yellow underline' to='/exercises'>
                    move
                  </Link>
                </span>
              </p>
            </div>
          </div>
        </section>
      )}
      <Link
        target='_blank'
        to='https://deskdetour.com/buy-me-a-coffee'
        className='group text-white-black-scheme bg-yellow border-yellow absolute right-4 bottom-4 flex h-8 w-8 items-center gap-1 overflow-hidden rounded-full border px-[8px] transition-all duration-300 hover:w-[149.5px]'
      >
        <span>
          <BiCoffeeTogo />
        </span>
        <span className='text-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
          Buy me a coffee
        </span>
      </Link>
    </main>
  );
}
