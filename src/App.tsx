import { HashRouter, Routes, Route } from 'react-router';
import RootLayout from './layout/RootLayout';
import Home from './views/Home';
import HowItWorks from './views/HowItWorks';
import BuyMeACoffee from './views/BuyMeACoffee';
import Exercises from './views/Exercises';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path='/exercises' element={<Exercises />} />
          <Route path='/buy-me-a-coffee' element={<BuyMeACoffee />} />
          <Route path='/how-it-works' element={<HowItWorks />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
