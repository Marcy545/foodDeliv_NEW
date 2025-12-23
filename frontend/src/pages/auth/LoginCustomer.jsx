import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt, FaArrowLeft } from 'react-icons/fa';
import { authService } from '../../services/authService';

const LoginCustomer = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await authService.login(email, password);
      authService.setSession(data.token, data.user);
      navigate('/customer-dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f0f9f1] flex flex-col justify-center items-center p-4 font-['Poppins']">
      {/* Tombol Back Pojok Kiri Atas */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-green-700 hover:text-green-900 font-bold transition-all cursor-pointer bg-white py-2 px-4 rounded-full shadow-md hover:shadow-lg"
      >
        <FaArrowLeft /> Kembali
      </button>

      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-green-600 p-8 text-center border-b border-green-100">
          <h2 className="text-2xl font-bold text-white tracking-tight">Login Customer</h2>
          <p className="text-white text-sm mt-1">Silakan login untuk memesan makanan</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 block">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" placeholder="nama@email.com" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 block">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="password" placeholder="********" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          <button className="w-full bg-[#2e7d32] hover:bg-green-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95">
            <FaSignInAlt /> LOGIN
          </button>

          <p className="text-center text-sm text-gray-500">
            Belum punya akun? <Link to="/register-customer" className="text-green-700 font-bold hover:underline">Daftar Sekarang</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginCustomer;