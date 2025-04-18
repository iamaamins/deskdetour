import { EXERCISES } from '../data/EXERCISES';

export default function Exercises() {
  return (
    <main className='mx-auto w-xl'>
      <section className='flex h-screen flex-col justify-center space-y-4'>
        <h1 className='text-3xl font-bold'>
          Exercises I Do During Move Sessions:
        </h1>
        {EXERCISES.map((exercise, index) => (
          <div className='flex gap-4'>
            <span className='bg-green flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full font-semibold text-white'>
              {index + 1}
            </span>
            <div>
              <h2 className='font-semibold'>
                {exercise.quantity} {exercise.name}
              </h2>
              <p className='opacity-90'>
                {exercise.description} Here's a quick YouTube video on{' '}
                <a href={exercise.url} className='text-peach underline'>
                  how to do {exercise.name.toLowerCase()}.
                </a>
              </p>
            </div>
          </div>
        ))}
        <p>
          Working 8 hours a day, 5 days a week adds up to 600 push-ups, 600
          bodyweight squats, and 1,800 jumping jacks per week. It adds up faster
          than you'd think.
        </p>
        <p>
          If your workplace isn't exercise-friendly, even a 2-minute brisk walk
          every hour can make a big difference to your health. Happy working!
        </p>
      </section>
    </main>
  );
}
