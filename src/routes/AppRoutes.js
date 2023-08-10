import { BrowserRouter, Route, Routes } from 'react-router-dom';
import  PurebetSwipe  from '../views/components/PurebetSwipe';
import NotFound from '../views/NotFound';
import MainLayout from './MainLayout';

/**
 * Renders Application routes depending on Logged or Anonymous users
 * @component AppRoutes
 */
const AppRoutes = () => {
  return (
    <MainLayout>
        <BrowserRouter>
            <Routes>
              <Route path="/404" element={<NotFound />} /> {/* In case when we want to Navigate to 404*/}
              <Route path="/*" element={<PurebetSwipe />} />
            </Routes>
         </BrowserRouter>
    </MainLayout>)
};

export default AppRoutes;
