import { IoArrowUpOutline, IoSparklesOutline } from 'react-icons/io5';
import { EXERCISES } from '../data/EXERCISES';

export default function Exercises() {
  return (
    <main className='h-full overflow-y-auto px-9 pt-[34px] pb-7 [scrollbar-color:#c9d0ca_transparent] [scrollbar-width:thin]'>
      <header className='min-h-[67px] max-w-[510px]'>
        <p className='mb-1 text-[11px] font-[750] text-[var(--primary)] uppercase'>
          Exercise library
        </p>
        <h1 className='text-[27px] leading-[1.15] font-[650]'>
          Small moves, real momentum.
        </h1>
        <p className='mt-[9px] text-sm leading-normal text-[var(--muted)]'>
          Pick one for your two-minute break, or simply walk and stretch if that
          works better for your space.
        </p>
      </header>

      <section className='mt-[25px] grid auto-rows-fr grid-cols-3 gap-2.5'>
        {EXERCISES.map((exercise, index) => (
          <article
            className='grid min-h-[225px] grid-rows-[auto_54px_1fr_auto] rounded-[17px] border border-[rgba(223,228,223,0.92)] bg-[rgba(255,255,255,0.88)] p-[17px] shadow-[0_18px_50px_rgba(36,52,43,0.08)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(36,52,43,0.12)]'
            key={exercise.name}
          >
            <div className='flex items-center justify-between'>
              <span className='text-[10px] font-[750] text-[#a5ada8]'>
                0{index + 1}
              </span>
              <span className='rounded-full bg-[var(--primary-soft)] px-2 py-[5px] text-[10px] font-bold text-[var(--primary)]'>
                {exercise.quantity} reps
              </span>
            </div>
            <h2 className='mt-6 text-[17px] leading-[1.3] font-[650]'>
              {exercise.name}
            </h2>
            <p className='pt-[7px] text-[11.5px] leading-[1.46] text-[var(--muted)]'>
              {exercise.description}
            </p>
            <a
              className='group inline-flex items-center gap-1 self-end text-[11px] font-bold text-[var(--primary)]'
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

      <aside className='mt-[11px] flex items-center gap-[13px] rounded-[15px] border border-[rgba(223,228,223,0.92)] bg-[rgba(255,255,255,0.88)] px-4 py-[13px]'>
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
