import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import DashboardPage from './pages/Dashboard/Dashboard';
import Products from './pages/Products/Products';
import MyLeads from './pages/My Leads/MyLeads';
import Settings from './pages/Settings/Settings';
import Enquiry from './pages/Enquiry/Enquiry';



  const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />}>
           <Route index element={<DashboardPage />} />
            <Route path='products' element={<Products />} />
            <Route path='myleads' element={<MyLeads />} />
            <Route path='settings' element={<Settings />} />
            <Route path='enquiry' element={<Enquiry />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
