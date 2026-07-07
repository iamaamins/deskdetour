import {
  IoArrowUpOutline,
  IoEyeOutline,
  IoNotificationsOutline,
  IoPauseOutline,
  IoPlayOutline,
  IoTimerOutline,
} from 'react-icons/io5';
import { HOW_IT_WORKS } from '../data/HOW_IT_WORKS';

const icons = [
  IoPlayOutline,
  IoTimerOutline,
  IoEyeOutline,
  IoNotificationsOutline,
  IoPauseOutline,
  IoTimerOutline,
];

export default function HowItWorks() {
  return (
    <main className='h-full w-full overflow-y-auto px-9 pt-[34px] pb-7 [scrollbar-color:#c9d0ca_transparent] [scrollbar-width:thin]'>
      <header className='flex min-h-[67px] max-w-[510px] items-start justify-between'>
        <div>
          <p className='mb-1 text-[11px] font-[750] tracking-[0.13em] text-[var(--primary)] uppercase'>
            The system
          </p>
          <h1 className='text-[27px] leading-[1.15] font-[650] tracking-[-0.035em]'>
            A healthier rhythm, on autopilot.
          </h1>
          <p className='mt-[9px] max-w-[510px] text-sm leading-normal text-[var(--muted)]'>
            Desk Detour runs quietly in the background and brings you back to
            the right habit at the right time.
          </p>
        </div>
      </header>

      <section className='mt-[25px] grid grid-cols-3 gap-2.5'>
        {HOW_IT_WORKS.map((item, index) => {
          const Icon = icons[index];
          return (
            <article
              className='relative min-h-[130px] rounded-2xl border border-[rgba(223,228,223,0.92)] bg-[rgba(255,255,255,0.88)] p-[15px] shadow-[0_18px_50px_rgba(36,52,43,0.08)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(36,52,43,0.12)]'
              key={item.title}
            >
              <span className='grid size-[33px] place-items-center rounded-[10px] bg-[var(--primary-soft)] text-[var(--primary)] [&_svg]:size-4'>
                <Icon aria-hidden='true' />
              </span>
              <span className='absolute top-[18px] right-[15px] text-[10px] font-[750] tracking-[0.11em] text-[#a5ada8]'>
                0{index + 1}
              </span>
              <h2 className='mt-3.5 mb-1 text-[13px] font-[680]'>
                {item.title}
              </h2>
              <p className='text-[10.5px] leading-[1.4] text-[var(--muted)]'>
                {item.description}
              </p>
            </article>
          );
        })}
      </section>

      <footer className='mt-[13px] flex items-center justify-between px-[3px] text-[10.5px] text-[var(--muted)]'>
        <p className='m-0'>
          Made thoughtfully by{' '}
          <a
            className='group inline-flex items-center gap-[3px] font-bold text-[var(--primary)]'
            href='https://x.com/iamaamins'
            target='_blank'
            rel='noreferrer'
          >
            @iamaamins{' '}
            <IoArrowUpOutline
              className='size-[11px] rotate-45 transition-transform duration-150 group-hover:-translate-y-0.5'
              aria-hidden='true'
            />
          </a>
        </p>
        <a
          className='group inline-flex items-center gap-[3px] font-bold text-[var(--primary)]'
          href='https://deskdetour.com/subscribe'
          target='_blank'
          rel='noreferrer'
        >
          Get product updates{' '}
          <IoArrowUpOutline
            className='size-[11px] rotate-45 transition-transform duration-150 group-hover:-translate-y-0.5'
            aria-hidden='true'
          />
        </a>
      </footer>
    </main>
  );
}
