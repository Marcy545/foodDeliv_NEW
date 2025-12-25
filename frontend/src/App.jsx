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
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CreateOrder from './pages/customer/CreateOrder';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderHistoryPage from './pages/customer/OrderHistoryPage';
import PaymentPage from './pages/customer/PaymentPage';
import AdminReviewPage from './pages/restaurant/AdminReviewPage';
import FavoritePage from './pages/customer/favoritePage';

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
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/order" element={<CreateOrder />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/history" element={<OrderHistoryPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/admin-reviews" element={<AdminReviewPage />} />
        <Route path="/favorites" element={<FavoritePage />} />
      </Routes>
    </Router>
  );
}

export default App;