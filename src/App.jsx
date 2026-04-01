import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import DashboardPage from './pages/Dashboard/Dashboard';
import Products from './pages/Products/Products';
import ProductCreation from './pages/ProductCreation/productcreation';
import ProductPage from './pages/ProductPage/ProductPage';
import ProductEdit from './pages/ProductEdit/ProductEdit';
import MyLeads from './pages/My Leads/MyLeads';
import Settings from './pages/Settings/Settings';
import Enquiry from './pages/Enquiry/Enquiry';
import PricingPlans from './pages/PricingPlans/PricingPlans';
import Wishlist from './pages/Wishlist/Wishlist';
import MobileNavbar from './components/MobileNavbar/MobileNavbar';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import useAppContext from './context/AppContext';
import AuthenticationModal from './components/AuthenticationModal/AuthenticationModal';
import { useLocation } from 'react-router-dom';

const AppContent = () => {
  const { openAuthenticationModal } = useAppContext();
  const location = useLocation();
  const authRoutes = ['/sign-in', '/sign-up', '/forgot-password'];
  const isAuthPage = authRoutes.includes(location.pathname);

  return (
    <>
      {!isAuthPage && <MobileNavbar />}
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path='products' element={<Products />} />
          <Route path='productcreation' element={<ProductCreation />} />
          <Route path='productcreation/:mode' element={<ProductCreation />} />
          <Route path='productpage/:id' element={<ProductPage />} />
          <Route path='productedit/:id' element={<ProductEdit />} />
          <Route path='myleads' element={<MyLeads />} />
          <Route path='settings' element={<Settings />} />
          <Route path='enquiry' element={<Enquiry />} />
          <Route path='pricing-plans' element={<PricingPlans />} />
          <Route path='wishlist' element={<Wishlist />} />
        </Route>
        <Route path='sign-in' element={<SignIn />} />
        <Route path='sign-up' element={<SignUp />} />
        <Route path='forgot-password' element={<ForgotPassword />} />
      </Routes>
      {openAuthenticationModal && <AuthenticationModal />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
