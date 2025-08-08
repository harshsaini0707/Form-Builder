import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Shell from './components/layout/Shell';
import Dashboard from './pages/Dashboard';
import FormBuilder from './pages/FormBuilder';

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Shell />}>
            <Route index element={<Dashboard />} />
            <Route path="builder" element={<FormBuilder />} />
            <Route path="builder/:id" element={<FormBuilder />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster position="top-right" gutter={12} toastOptions={{ duration: 3500 }} />
    </>
  );
}
