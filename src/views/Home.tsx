import { useEffect, useState } from 'react';
import { TimerState } from '../types';
import { RiResetLeftLine } from 'react-icons/ri';

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
          <div className='flex items-center gap-2'>
            <button
              onClick={() => window.timer.reset()}
              className='bg-slight-gray flex h-10 w-10 cursor-pointer items-center justify-center rounded-md'
            >
              <RiResetLeftLine />
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
