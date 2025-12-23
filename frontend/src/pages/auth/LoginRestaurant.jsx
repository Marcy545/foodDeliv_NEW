import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStore, FaSignInAlt, FaArrowLeft, FaEnvelope, FaLock } from 'react-icons/fa';
import { authService } from '../../services/authService';

const LoginRestaurant = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      authService.setSession(data.token, data.user);
      const userRole = data.user.role.toLowerCase();

      if (userRole !== 'restaurant' && userRole !== 'admin') {
        alert("Akses Ditolak!");
        authService.logout(); 
        return;
      }
      navigate('/admin-dashboard');
      alert(`Selamat Datang, ${data.user.name}!`);

    } catch (err) {
      alert("Gagal: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-green-50 flex flex-col items-center justify-center p-4 font-['Poppins']">
      {/* Tombol Back Pojok Kiri Atas */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-green-600 hover:text-green-800 font-bold transition-all cursor-pointer bg-white py-2 px-4 rounded-full shadow-md hover:shadow-lg"
      >
        <FaArrowLeft /> Kembali
      </button>

      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border-t-8 border-green-500">
        <div className="p-8 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaStore className="text-green-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Restaurant Panel</h2>
        </div>

        <form onSubmit={handleLogin} className="px-8 pb-8 space-y-5">
           <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 block">Email Admin</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" placeholder="admin@gmail.com" className="w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-green-500 outline-none" onChange={(e) => setEmail(e.target.value)} required />
              </div>
           </div>
           
           <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 block">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" placeholder="********" className="w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-green-500 outline-none" onChange={(e) => setPassword(e.target.value)} required />
              </div>
           </div>

          <button disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer">
            {loading ? 'MEMPROSES...' : <><FaSignInAlt /> MASUK PANEL</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginRestaurant;