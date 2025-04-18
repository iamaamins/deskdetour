import buyMeACoffeeQR from '../assets/buy-me-a-coffee-qr.jpg';

export default function BuyMeACoffee() {
  return (
    <main className='mx-auto w-xl'>
      <section className='flex h-screen flex-col items-center justify-center space-y-4 text-center'>
        <div className='max-w-md space-y-2'>
          <h1 className='text-3xl font-bold'>Buy Me a Coffee</h1>
          <p className='opacity-90'>
            Buy me a coffee to support the development and keep Desk Detour free
            for everyone!
          </p>
        </div>
        <img
          src={buyMeACoffeeQR}
          alt='Buy me a coffee QR code'
          className='h-72 w-72 rounded-4xl'
        />
        <p className='text-sm opacity-90'>Thank you for your support!</p>
      </section>
    </main>
  );
}
