import { Outlet } from 'react-router';
import Navigation from './Navigation';

export default function RootLayout() {
  return (
    <div className='app-shell'>
      <Navigation />
      <div className='page-shell'>
        <Outlet />
      </div>
    </div>
  );
}
