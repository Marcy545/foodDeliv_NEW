import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingBasket, FaUtensils } from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-['Poppins'] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?fit=crop&w=1200&q=80')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 bg-white/95 p-10 md:p-14 rounded-[40px] shadow-2xl max-w-[95%] sm:max-w-[650px] w-full mx-4 text-center border border-white/20">
        <h1 className="font-bold text-3xl md:text-[2.8rem] text-[#333] mb-4">Pilih Akses Anda</h1>
        <p className="text-sm md:text-[1.15rem] text-[#555] border-b border-gray-200 pb-8 mb-10">
          Selamat datang di layanan <span className="font-bold text-green-600">Food Delivery System</span>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Tombol Customer dengan class .landing-btn */}
          <button
            onClick={() => navigate('/login-customer')}
            className="landing-btn group flex flex-col items-center justify-center gap-4 bg-[#4CAF50] hover:bg-[#43a047] text-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
          >
            <div className="p-4 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <FaShoppingBasket className="text-5xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs opacity-90 font-light mb-1 italic">Akses sebagai</span>
              <span className="text-xl font-black uppercase tracking-widest">Customer</span>
            </div>
          </button>

          {/* Tombol Restaurant dengan class .landing-btn */}
          <button
            onClick={() => navigate('/login-restaurant')}
            className="landing-btn group flex flex-col items-center justify-center gap-4 bg-[#FF9800] hover:bg-[#fb8c00] text-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
          >
            <div className="p-4 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <FaUtensils className="text-5xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs opacity-90 font-light mb-1 italic">Akses sebagai</span>
              <span className="text-xl font-black uppercase tracking-widest">Restaurant</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;