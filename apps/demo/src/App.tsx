import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AdvancedDemo } from './pages/advanced';
import { BasicDemo } from './pages/basic';
import { ComparisonDemo } from './pages/comparison';
import { HomePage } from './pages/home';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/basic" element={<BasicDemo />} />
        <Route path="/advanced" element={<AdvancedDemo />} />
        <Route path="/comparison" element={<ComparisonDemo />} />
      </Routes>
    </BrowserRouter>
  );
};
