import { HOW_IT_WORKS } from '../data/HOW_IT_WORKS';

export default function HowItWorks() {
  return (
    <main className='mx-auto w-xl'>
      <section className='flex h-screen flex-col justify-center space-y-4'>
        <h1 className='text-3xl font-bold'>How Desk Detour Works?</h1>
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
        <p className='text-sm opacity-90'>
          Made by{' '}
          <a
            href='https://x.com/iamaamins'
            target='_blank'
            className='text-peach underline'
          >
            @iamaamins
          </a>
        </p>
      </section>
    </main>
  );
}
