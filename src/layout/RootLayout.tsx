import { Outlet } from 'react-router';
import Navigation from './Navigation';

export default function RootLayout() {
  return (
    <div className='grid h-screen w-screen grid-cols-[176px_minmax(0,1fr)]'>
      <Navigation />
      <div className='h-screen min-w-0 overflow-hidden'>
        <Outlet />
      </div>
    </div>
  );
}
