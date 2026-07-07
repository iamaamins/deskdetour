import { IoArrowUpOutline, IoSparklesOutline } from 'react-icons/io5';
import { EXERCISES } from '../data/EXERCISES';

export default function Exercises() {
  return (
    <main className='h-full w-full overflow-y-auto px-9 pt-[34px] pb-7 [scrollbar-color:#c9d0ca_transparent] [scrollbar-width:thin]'>
      <header className='flex min-h-[67px] max-w-[510px] items-start justify-between'>
        <div>
          <p className='mb-1 text-[11px] font-[750] tracking-[0.13em] text-[var(--primary)] uppercase'>
            Movement library
          </p>
          <h1 className='text-[27px] leading-[1.15] font-[650] tracking-[-0.035em]'>
            Small moves, real momentum.
          </h1>
          <p className='mt-[9px] max-w-[510px] text-sm leading-normal text-[var(--muted)]'>
            Pick one for your two-minute break, or simply walk and stretch if
            that works better for your space.
          </p>
        </div>
      </header>

      <section className='mt-[25px] grid grid-cols-3 gap-2.5'>
        {EXERCISES.map((exercise, index) => (
          <article
            className='flex min-h-[215px] flex-col rounded-[17px] border border-[rgba(223,228,223,0.92)] bg-[rgba(255,255,255,0.88)] p-[17px] shadow-[0_18px_50px_rgba(36,52,43,0.08)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(36,52,43,0.12)]'
            key={exercise.name}
          >
            <div className='flex items-center justify-between'>
              <span className='text-[10px] font-[750] tracking-[0.11em] text-[#a5ada8]'>
                0{index + 1}
              </span>
              <span className='rounded-full bg-[var(--primary-soft)] px-2 py-[5px] text-[10px] font-bold text-[var(--primary)]'>
                {exercise.quantity} reps
              </span>
            </div>
            <h2 className='mt-6 mb-[7px] text-[17px] font-[650] tracking-[-0.02em]'>
              {exercise.name}
            </h2>
            <p className='text-[11.5px] leading-[1.46] text-[var(--muted)]'>
              {exercise.description}
            </p>
            <a
              className='group mt-auto inline-flex items-center gap-1 text-[11px] font-bold text-[var(--primary)]'
              target='_blank'
              rel='noreferrer'
              href={exercise.url}
            >
              Watch technique{' '}
              <IoArrowUpOutline
                className='size-[11px] rotate-45 transition-transform duration-150 group-hover:-translate-y-0.5'
                aria-hidden='true'
              />
            </a>
          </article>
        ))}
      </section>

      <aside className='mt-[11px] flex items-center gap-[13px] rounded-[15px] border border-[rgba(223,228,223,0.92)] bg-[rgba(255,255,255,0.88)] px-4 py-[13px] shadow-none'>
        <span className='grid size-8 shrink-0 place-items-center rounded-[10px] bg-[var(--warm-soft)] text-[#9b652d] [&_svg]:size-[15px]'>
          <IoSparklesOutline aria-hidden='true' />
        </span>
        <p className='text-[11.5px] leading-[1.45] text-[var(--muted)]'>
          <strong className='block text-xs text-[var(--ink)]'>
            Consistency beats intensity.
          </strong>
          A few deliberate minutes each hour can add up to meaningful movement
          across your week.
        </p>
      </aside>
    </main>
  );
}
