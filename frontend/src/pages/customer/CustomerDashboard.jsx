import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaSmile, 
  FaShoppingCart, 
  FaShoppingBasket, 
  FaHistory, 
  FaHeart, 
  FaSignOutAlt,
  FaBolt,         
  FaShoppingBag,   
  FaCoffee,       
  FaStar,
  FaUtensils
} from 'react-icons/fa';
import { authService } from '../../services/authService';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [customer, setCustomer] = useState({ name: 'Customer' });
  
  // Flag untuk mencegah alert muncul dua kali akibat React Strict Mode
  const hasAlerted = useRef(false); 

  useEffect(() => {
    const savedUser = localStorage.getItem('user');

    // 1. Validasi keberadaan session
    if (!savedUser) {
      navigate('/');
      return;
    }

    const userObj = JSON.parse(savedUser);

    // 2. Proteksi Role
    if (userObj.role !== 'CUSTOMER') {
      navigate('/'); 
      return;
    }

    setCustomer(userObj);

    // 3. Logika Alert (Hanya muncul jika dipicu dari Login dan belum muncul sebelumnya)
    if (location.state?.fromLogin && !hasAlerted.current) {
      alert(`Selamat Datang, ${userObj.name}! Login berhasil.`);
      
      // Set flag menjadi true agar tidak terulang pada render kedua (Strict Mode)
      hasAlerted.current = true;
      
      // Bersihkan state navigasi agar tidak muncul lagi saat refresh manual
      window.history.replaceState({}, document.title);
    }
  }, [navigate, location]);

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      authService.logout();
      // Redirect sudah dihandle di dalam authService.logout, 
      // tapi navigate ini sebagai backup jika diperlukan.
      navigate('/');
    }
  };

  // Helper untuk class active pada NavLink
  const navClass = ({ isActive }) =>
    `btn rounded-pill px-4 py-2 shadow-sm d-flex align-items-center gap-2 text-decoration-none transition-all ${
      isActive ? 'btn-success text-white' : 'btn-outline-success bg-white text-success'
    }`;

  return (
    <div style={{ backgroundColor: '#f6f8f5', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
      
      {/* Tombol Logout Pojok Kiri Atas */}
      <div className="position-absolute" style={{ top: 20, left: 25, zIndex: 10 }}>
        <button
          onClick={handleLogout}
          className="btn btn-outline-success bg-white rounded-pill px-3 py-1 shadow-sm d-flex align-items-center gap-2 hover-shadow"
        >
          Logout <FaSignOutAlt size={14} />
        </button>
      </div>

      <div className="container">

        {/* NAVIGASI UTAMA */}
        <nav className="d-flex justify-content-center flex-wrap gap-3 py-5">
          <NavLink to="/cart" className={navClass}>
            <FaShoppingCart /> Keranjang Saya
          </NavLink>

          <NavLink to="/order" className={navClass}>
            <FaShoppingBasket /> Pesan Sekarang
          </NavLink>

          <NavLink to="/history" className={navClass}>
            <FaHistory /> Riwayat Order
          </NavLink>

          <NavLink to="/favorites" className={({ isActive }) =>
            `btn rounded-pill px-4 py-2 shadow-sm d-flex align-items-center gap-2 text-decoration-none transition-all ${
              isActive ? 'btn-danger text-white' : 'btn-outline-danger bg-white text-danger'
            }`
          }>
            <FaHeart /> Menu Favorit
          </NavLink>
        </nav>

        {/* HERO SECTION */}
        <section
          className="text-center py-5 shadow-lg text-white"
          style={{
            background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
            borderRadius: '40px'
          }}
        >
          <h1 className="fw-bold mb-3 display-4 d-flex justify-content-center align-items-center gap-3 px-3">
            <FaSmile /> Selamat Datang, {customer.name}!
          </h1>
          <p className="opacity-75 mb-4 fs-5 px-3">
            Pesan menu favorit Anda dengan mudah dan cepat 🍽️
          </p>
          <NavLink
            to="/order"
            className="btn btn-light rounded-pill px-5 py-3 fw-bold shadow-lg text-success text-decoration-none hover-scale"
          >
            <FaUtensils /> Lihat Menu
          </NavLink>
        </section>

        {/* FEATURE CARDS */}
        <div className="row g-4 my-5 pb-5 px-3">
          {[
            { icon: <FaBolt />, title: 'Proses Cepat', desc: 'Pesan hanya dengan beberapa klik.' },
            { icon: <FaShoppingBag />, title: 'Pilihan Lengkap', desc: 'Menu lengkap tersedia setiap hari.' },
            { icon: <FaCoffee />, title: 'Kualitas Terbaik', desc: 'Bahan segar dan koki berkualitas.' },
            { icon: <FaStar />, title: 'Ulasan Pelanggan', desc: 'Lihat nilai dan review dari pengguna lain.' }
          ].map((f, i) => (
            <div className="col-md-3" key={i}>
              <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100 transition-up">
                <div className="text-success fs-1 mb-3 d-flex justify-content-center">{f.icon}</div>
                <h5 className="fw-bold text-success">{f.title}</h5>
                <p className="text-muted small mb-0">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <footer className="text-center py-4 text-muted small">
          © 2025 Food Delivery System • Developed with ❤️
        </footer>
      </div>

      {/* CUSTOM CSS UNTUK ANIMASI */}
      <style>{`
        .transition-up { transition: all .3s ease-in-out; }
        .transition-up:hover { transform: translateY(-8px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }
        .hover-scale { transition: transform .2s ease; }
        .hover-scale:hover { transform: scale(1.05); }
        .hover-shadow:hover { box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
      `}</style>
    </div>
  );
};

export default CustomerDashboard;