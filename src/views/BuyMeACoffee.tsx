import bmcButton from '../assets/bmc-button.png';
import { Link } from 'react-router';

export default function BuyMeACoffee() {
  return (
    <main className='mx-auto w-xl'>
      <section className='flex h-screen flex-col items-center justify-center space-y-6 text-center'>
        <div className='max-w-md space-y-2'>
          <h1 className='text-3xl font-bold'>Buy Me a Coffee</h1>
          <p className='opacity-90'>
            Buy me a coffee (or two) to support the development and keep Desk
            Detour free for everyone!
          </p>
        </div>
        <Link to='https://www.buymeacoffee.com/iamaamins' target='_blank'>
          <img
            src={bmcButton}
            alt='Buy Me A Coffee'
            className='h-[60px] w-[217px]'
          />
        </Link>
        <p className='text-sm opacity-90'>Thank you for your support 💛</p>
      </section>
    </main>
  );
}
