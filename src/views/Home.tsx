import { useEffect, useState } from 'react';
import { TimerState } from '../types';
import { RiResetLeftLine } from 'react-icons/ri';
import { IoEyeOutline } from 'react-icons/io5';
import { IoDesktopOutline } from 'react-icons/io5';
import { Link } from 'react-router';
import { MdOutlineSportsGymnastics } from 'react-icons/md';

export default function Home() {
  const [timer, setTimer] = useState<TimerState | null>(null);

  useEffect(() => {
    return window.timer.onUpdate((state) => setTimer(state));
  }, []);

  return (
    <main className='mx-auto w-xl'>
      {timer && (
        <section className='flex h-screen flex-col items-center justify-center gap-2'>
          <p className='text-2xl font-medium'>
            {timer.isWorkTime
              ? 'Work'
              : timer.isViewTime
                ? 'View'
                : timer.isMoveTime && 'Move'}
          </p>
          <div className='flex items-center text-9xl font-bold'>
            <p>{Math.floor(timer.timeRemaining / 60)}</p>
            <span>:</span>
            <p>
              {Math.floor(timer.timeRemaining % 60)
                .toString()
                .padStart(2, '0')}
            </p>
          </div>
          <button
            onClick={() => window.timer.reset()}
            className='bg-slight-gray flex cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2'
          >
            <RiResetLeftLine /> Reset
          </button>
          <div className='border-slight-gray mt-2 space-y-2 rounded-xl border p-4'>
            <p className='text-lg font-medium'>Coming up:</p>
            <div className='flex items-center gap-4'>
              <p className='flex items-center gap-1.5'>
                <span className='border-green bg-green/50 flex h-6 w-6 items-center justify-center rounded-md border p-1'>
                  {timer.isWorkTime ? (
                    <IoEyeOutline />
                  ) : timer.sessionCount < 3 &&
                    (timer.isViewTime || timer.isMoveTime) ? (
                    <IoDesktopOutline />
                  ) : (
                    <MdOutlineSportsGymnastics />
                  )}{' '}
                </span>
                <span>
                  {timer.isWorkTime
                    ? 'View'
                    : timer.sessionCount < 3 &&
                        (timer.isViewTime || timer.isMoveTime)
                      ? 'Work'
                      : 'Move'}{' '}
                  session
                </span>
              </p>
              <p className='flex items-center gap-1.5'>
                <span className='border-green bg-green/50 flex h-6 w-6 items-center justify-center rounded-md border p-1 font-bold'>
                  {3 - timer.sessionCount}
                </span>
                <span>
                  {3 - timer.sessionCount > 1 ? 'sessions' : 'session'} before{' '}
                  <Link className='text-peach underline' to='/exercises'>
                    move
                  </Link>
                </span>
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
