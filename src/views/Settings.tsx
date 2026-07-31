import { useEffect, useState } from 'react';
import { IoFitnessOutline } from 'react-icons/io5';
import type { TimerState } from '../types';

export default function Settings() {
  const [timer, setTimer] = useState<TimerState | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => window.timer.onUpdate(setTimer), []);

  const toggleLongMoveBreaks = async () => {
    if (!timer || isUpdating) return;

    setIsUpdating(true);
    setError(null);

    try {
      if (timer.isLongMoveBreaksEnabled) {
        await window.timer.disableLongMoveBreaks();
      } else {
        await window.timer.enableLongMoveBreaks();
      }
    } catch {
      setError('The setting could not be changed. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <main className='h-full px-9 pt-[34px] pb-7'>
      <header className='min-h-[67px] max-w-[510px]'>
        <p className='mb-1 text-[11px] font-[750] text-[var(--primary)] uppercase'>
          Preferences
        </p>
        <h1 className='text-[27px] leading-[1.15] font-[650]'>Settings</h1>
        <p className='mt-[9px] text-sm leading-normal text-[var(--muted)]'>
          Adjust Desk Detour for the way you work today.
        </p>
      </header>

      <section className='mt-[25px] rounded-[17px] border border-[rgba(223,228,223,0.92)] bg-[rgba(255,255,255,0.88)] p-[18px] shadow-[0_18px_50px_rgba(36,52,43,0.08)]'>
        <div className='flex items-center justify-between gap-8'>
          <div className='flex min-w-0 items-start gap-3'>
            <span className='grid size-[41px] shrink-0 place-items-center rounded-xl bg-[#e7edf4] text-[#506d8c] [&_svg]:size-[19px]'>
              <IoFitnessOutline aria-hidden='true' />
            </span>
            <div>
              <h2 className='text-sm font-[680]'>Long move breaks</h2>
              <p className='mt-1 max-w-[340px] text-[12.5px] leading-[1.45] text-[var(--muted)]'>
                Extend move breaks from 2.5 minutes to 5 minutes.
              </p>
            </div>
          </div>

          <button
            type='button'
            role='switch'
            aria-label='Long move breaks'
            aria-checked={timer?.isLongMoveBreaksEnabled ?? true}
            disabled={!timer || isUpdating}
            onClick={toggleLongMoveBreaks}
            className={
              timer?.isLongMoveBreaksEnabled !== false
                ? 'relative h-[28px] w-[48px] shrink-0 cursor-pointer rounded-full border-0 bg-[var(--primary)] p-0 shadow-inner transition-colors duration-150 disabled:cursor-wait disabled:opacity-60'
                : 'relative h-[28px] w-[48px] shrink-0 cursor-pointer rounded-full border-0 bg-[#cfd5d0] p-0 shadow-inner transition-colors duration-150 disabled:cursor-wait disabled:opacity-60'
            }
          >
            <span
              className={
                timer?.isLongMoveBreaksEnabled !== false
                  ? 'absolute top-[3px] left-[23px] size-[22px] rounded-full bg-white shadow-[0_2px_5px_rgba(23,34,29,0.22)] transition-[left] duration-150'
                  : 'absolute top-[3px] left-[3px] size-[22px] rounded-full bg-white shadow-[0_2px_5px_rgba(23,34,29,0.22)] transition-[left] duration-150'
              }
            />
          </button>
        </div>

        <div className='mt-[17px] border-t border-[var(--line)] pt-[13px] text-[11.5px] text-[var(--muted)]'>
          Current duration:{' '}
          <strong className='font-[680] text-[var(--ink)]'>
            {timer
              ? timer.isLongMoveBreaksEnabled
                ? '5 minutes'
                : '2.5 minutes'
              : 'Loading…'}
          </strong>
        </div>

        {error ? (
          <p
            className='mt-2 text-[11.5px] font-[600] text-[#a34b42]'
            role='alert'
          >
            {error}
          </p>
        ) : null}
      </section>

      <p className='mt-3 px-1 text-[11.5px] text-[var(--muted)]'>
        This setting returns to five minutes whenever Desk Detour restarts.
      </p>
    </main>
  );
}
