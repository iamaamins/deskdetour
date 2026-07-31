import { HashRouter, Routes, Route } from 'react-router';
import RootLayout from './layout/RootLayout';
import Home from './views/Home';
import HowItWorks from './views/HowItWorks';
import Exercises from './views/Exercises';
import Settings from './views/Settings';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path='/exercises' element={<Exercises />} />
          <Route path='/how-it-works' element={<HowItWorks />} />
          <Route path='/settings' element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
