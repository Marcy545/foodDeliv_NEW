import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginCustomer from './pages/auth/LoginCustomer';
import RegisterCustomer from './pages/auth/RegisterCustomer';
import LoginRestaurant from './pages/auth/LoginRestaurant';
import AdminDashboard from './pages/restaurant/AdminDashboard';
import MenuManagement from './pages/restaurant/MenuManagement';
import AddMenu from './pages/restaurant/AddMenu';
import EditMenu from './pages/restaurant/EditMenu';
import ShowMenu from './pages/restaurant/ShowMenu';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login-customer" element={<LoginCustomer />} />
        <Route path="/register-customer" element={<RegisterCustomer />} />
        <Route path="/login-restaurant" element={<LoginRestaurant />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/manage-menu" element={<MenuManagement />} />
        <Route path="/add-menu" element={<AddMenu />} />
        <Route path="/edit-menu/:id" element={<EditMenu />} />
        <Route path="/show-menu/:id" element={<ShowMenu />} />
      </Routes>
    </Router>
  );
}

export default App;