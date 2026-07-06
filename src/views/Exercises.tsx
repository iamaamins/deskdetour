import { IoArrowUpOutline, IoSparklesOutline } from 'react-icons/io5';
import { EXERCISES } from '../data/EXERCISES';

export default function Exercises() {
  return (
    <main className='page scroll-page'>
      <header className='page-header page-header-copy'>
        <div>
          <p className='eyebrow'>Movement library</p>
          <h1>Small moves, real momentum.</h1>
          <p className='header-description'>
            Pick one for your two-minute break, or simply walk and stretch if
            that works better for your space.
          </p>
        </div>
      </header>

      <section className='exercise-grid'>
        {EXERCISES.map((exercise, index) => (
          <article className='exercise-card' key={exercise.name}>
            <div className='exercise-card-top'>
              <span className='exercise-number'>0{index + 1}</span>
              <span className='exercise-quantity'>
                {exercise.quantity} reps
              </span>
            </div>
            <h2>{exercise.name}</h2>
            <p>{exercise.description}</p>
            <a target='_blank' rel='noreferrer' href={exercise.url}>
              Watch technique <IoArrowUpOutline aria-hidden='true' />
            </a>
          </article>
        ))}
      </section>

      <aside className='insight-banner'>
        <span className='insight-icon'>
          <IoSparklesOutline aria-hidden='true' />
        </span>
        <p>
          <strong>Consistency beats intensity.</strong>A few deliberate minutes
          each hour can add up to meaningful movement across your week.
        </p>
      </aside>
    </main>
  );
}
