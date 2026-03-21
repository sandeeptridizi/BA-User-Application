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
import MobileNavbar from './components/MobileNavbar/MobileNavbar';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import OTPVerificationModal from './components/OTPVerificationModal/OTPVerificationModal';
import useAppContext from './context/AppContext';
import AuthenticationModal from './components/AuthenticationModal/AuthenticationModal';

const App = () => {
  const { openVerificationModel, openAuthenticationModal } = useAppContext();

  return (
    <BrowserRouter>
      <MobileNavbar />
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
        </Route>
        <Route path='sign-in' element={<SignIn />} />
        <Route path='sign-up' element={<SignUp />} />
      </Routes>
      {openVerificationModel && <OTPVerificationModal />}
      {openAuthenticationModal && <AuthenticationModal />}
    </BrowserRouter>
  );
};

export default App;
