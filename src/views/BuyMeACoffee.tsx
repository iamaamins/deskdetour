import bmcButton from '../assets/bmc-button.png';
import bmcQr from '../assets/bmc-qr.png';
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
        <div className='flex flex-col items-center space-y-2'>
          <img
            src={bmcQr}
            alt='Buy me a coffee QR code'
            className='h-56 w-56 rounded-md'
          />
          <p className='text-sm opacity-90'>Scan this QR code</p>
          <div className='flex items-center gap-2'>
            <div className='bg-slight-gray h-[1px] w-24'></div>
            <span className='text-sm opacity-90'>OR</span>
            <div className='bg-slight-gray h-[1px] w-24'></div>
          </div>
          <Link to='https://www.buymeacoffee.com/iamaamins' target='_blank'>
            <img
              src={bmcButton}
              alt='Buy me a coffee button'
              className='h-auto w-56 rounded-md'
            />
          </Link>
        </div>
        <p className='text-sm opacity-90'>Thanks for your support 💛</p>
      </section>
    </main>
  );
}
