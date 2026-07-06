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
    <main className='page scroll-page'>
      <header className='page-header page-header-copy'>
        <div>
          <p className='eyebrow'>The system</p>
          <h1>A healthier rhythm, on autopilot.</h1>
          <p className='header-description'>
            Desk Detour runs quietly in the background and brings you back to
            the right habit at the right time.
          </p>
        </div>
      </header>

      <section className='steps-grid'>
        {HOW_IT_WORKS.map((item, index) => {
          const Icon = icons[index];
          return (
            <article className='step-card' key={item.title}>
              <span className='step-icon'>
                <Icon aria-hidden='true' />
              </span>
              <span className='step-number'>0{index + 1}</span>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </article>
          );
        })}
      </section>

      <footer className='page-footer'>
        <p>
          Made thoughtfully by{' '}
          <a href='https://x.com/iamaamins' target='_blank' rel='noreferrer'>
            @iamaamins <IoArrowUpOutline aria-hidden='true' />
          </a>
        </p>
        <a
          href='https://deskdetour.com/subscribe'
          target='_blank'
          rel='noreferrer'
        >
          Get product updates <IoArrowUpOutline aria-hidden='true' />
        </a>
      </footer>
    </main>
  );
}
