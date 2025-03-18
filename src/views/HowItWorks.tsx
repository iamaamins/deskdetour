import { HOW_IT_WORKS } from '../data/HOW_IT_WORKS';

export default function HowItWorks() {
  return (
    <main className='mx-auto w-xl'>
      <section className='flex h-screen flex-col items-center justify-center space-y-4'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-bold'>How Desk Detour Works?</h1>
          <p className='opacity-80'>
            Desk Detour runs in the background and sends timely notifications,
            helping you maintain productivity while taking care of your health.
          </p>
        </div>
        <div className='space-y-2'>
          {HOW_IT_WORKS.map((el, index) => (
            <div className='flex gap-4'>
              <span className='bg-green flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full font-semibold text-white'>
                {index + 1}
              </span>
              <div>
                <h2 className='font-semibold'>{el.title}</h2>
                <p className='opacity-80'>{el.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
