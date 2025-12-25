import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaEgg, FaReceipt, FaListUl, FaSignOutAlt } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6'; // Import icon ulasan
import { authService } from '../../services/authService';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Keluar dari aplikasi?")) {
      authService.logout();
      navigate('/');
    }
  };

  return (
    <div className="sidebar shadow-lg">
      <div className="sidebar-brand text-white d-flex align-items-center mb-4 px-2">
        <FaEgg className="text-warning me-3" size={28} />
        <span className="fw-bold">Food Delivery</span>
      </div>
      
      <nav className="sidebar-menu">
        <NavLink 
          to="/admin-dashboard" 
          className={({ isActive }) => isActive ? "active" : ""}
        >
          <FaReceipt />
          <span>Pesanan Masuk</span>
        </NavLink>

        <NavLink 
          to="/manage-menu" 
          className={({ isActive }) => isActive ? "active" : ""}
        >
          <FaListUl />
          <span>Kelola Menu</span>
        </NavLink>

        {/* MENU BARU: Ulasan Pelanggan */}
        <NavLink 
          to="/admin-reviews" 
          className={({ isActive }) => isActive ? "active" : ""}
        >
          <FaMessage />
          <span>Ulasan Pelanggan</span>
        </NavLink>
      </nav>
      
      <div className="mt-auto">
        <button onClick={handleLogout} className="logout-btn d-flex align-items-center">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;