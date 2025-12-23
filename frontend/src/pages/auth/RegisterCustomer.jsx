import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaArrowLeft } from 'react-icons/fa';
import { authService } from '../../services/authService';

const RegisterCustomer = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validasi kecocokan password
    if (form.password !== form.confirmPassword) {
      alert("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    setLoading(true);
    try {
      await authService.register(form.name, form.email, form.password);
      alert("Registrasi Berhasil! Silakan Login.");
      navigate('/login-customer');
    } catch (err) {
      alert("Gagal Registrasi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center p-4 font-['Poppins']">
      
      {/* Tombol Back Pojok Kiri Atas */}
      <button 
        onClick={() => navigate('/login-customer')}
        className="absolute top-6 left-6 flex items-center gap-2 text-green-700 hover:text-green-900 font-bold transition-all cursor-pointer bg-white py-2 px-4 rounded-full shadow-md hover:shadow-lg"
      >
        <FaArrowLeft /> Kembali ke Login
      </button>

      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header Sederhana */}
        <div className="bg-green-600 p-8 text-center text-white">
          <h2 className="text-2xl font-bold tracking-tight">Daftar Akun Baru</h2>
          <p className="text-green-100 text-sm">Ayo mulai pengalaman kulinermu</p>
        </div>
        
        <form onSubmit={handleRegister} className="p-8 space-y-4">
          {/* Input Nama */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">Nama Lengkap</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Nama Lengkap" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" 
                onChange={(e) => setForm({...form, name: e.target.value})} 
                required 
              />
            </div>
          </div>

          {/* Input Email */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" 
                onChange={(e) => setForm({...form, email: e.target.value})} 
                required 
              />
            </div>
          </div>

          {/* Input Password */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all" 
                onChange={(e) => setForm({...form, password: e.target.value})} 
                required 
              />
            </div>
          </div>

          {/* Input Konfirmasi Password */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">Konfirmasi Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="password" 
                placeholder="Ulangi Password" 
                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${
                  form.confirmPassword && form.password !== form.confirmPassword 
                  ? 'border-red-500 focus:ring-red-200' 
                  : 'border-gray-200 focus:ring-2 focus:ring-green-500'
                }`}
                onChange={(e) => setForm({...form, confirmPassword: e.target.value})} 
                required 
              />
            </div>
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="text-xs text-red-500 italic mt-1">* Password tidak cocok</p>
            )}
          </div>

          {/* Tombol Daftar */}
          <button 
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-4`}
          >
            <FaUserPlus /> {loading ? 'MENDAFTARKAN...' : 'DAFTAR SEKARANG'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-2">
            Sudah punya akun? <Link to="/login-customer" className="text-green-600 font-bold hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterCustomer;