import { Outlet } from 'react-router';
import Navigation from './Navigation';

export default function RootLayout() {
  return (
    <div className='grid h-screen grid-cols-[204px_minmax(0,1fr)]'>
      <Navigation />
      <div className='min-w-0 overflow-hidden'>
        <Outlet />
      </div>
    </div>
  );
}
