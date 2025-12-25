import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaArrowLeft, FaUtensils } from 'react-icons/fa';
import { favoriteService } from '../../services/favoriteService';
import { menuService } from '../../services/menuService';

const FavoritePage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [favoriteMenus, setFavoriteMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      // Mengambil semua menu dan daftar favorit user secara paralel
      const [allMenus, favorites] = await Promise.all([
        menuService.getMenus(),
        favoriteService.getFavorites(user.id)
      ]);

      // Filter menu yang ID-nya ada dalam daftar favorit user
      const favIds = favorites.map(f => String(f.menu_id));
      const filtered = allMenus.filter(m => favIds.includes(String(m.id)));
      
      setFavoriteMenus(filtered);
    } catch (err) {
      console.error("Gagal memuat favorit:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.id) loadData();
  }, [user.id]);

  const renderImage = (imageStr) => {
    if (!imageStr) return null;
    let cleanStr = imageStr.trim().replace(/\s/g, '');
    if (cleanStr.includes('base64,')) cleanStr = cleanStr.split('base64,').pop();
    return cleanStr.length > 100 
      ? `data:image/jpeg;base64,${cleanStr}` 
      : `http://localhost:5002/storage/${cleanStr}`;
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="spinner-border text-danger" role="status"></div>
      <span className="ms-2 fw-bold text-danger">Memuat Menu Favorit...</span>
    </div>
  );

  return (
    <div className="favorite-page" style={{ background: '#f8fafb', minHeight: '100vh', fontFamily: 'Poppins' }}>
      <div className="container py-4">
        
        {/* Banner Header */}
        <div className="card border-0 shadow-sm text-white text-center p-4 mb-4" 
             style={{ background: 'linear-gradient(135deg, #ff5f6d 0%, #ffc371 100%)', borderRadius: '20px' }}>
          <h2 className="fw-bold mb-1"><FaHeart className="me-2" /> Menu Favorit Saya</h2>
          <p className="mb-0 opacity-75">Koleksi menu yang sudah Anda tandai sebagai favorit</p>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <button onClick={() => navigate('/order')} className="btn btn-white border shadow-sm rounded-pill px-4 bg-white text-muted small">
            <FaArrowLeft className="me-2" /> Kembali ke Menu
          </button>
          <span className="badge rounded-pill px-3 py-2 fw-bold shadow-sm" style={{ backgroundColor: '#ffebee', color: '#ff5252' }}>
            {favoriteMenus.length} Menu Favorit
          </span>
        </div>

        {/* Grid Menu Favorit */}
        <div className="row g-4 text-start">
          {favoriteMenus.length === 0 ? (
            <div className="text-center py-5 opacity-50 w-100">
              <FaUtensils size={60} className="mb-3" />
              <h4>Belum ada menu favorit</h4>
            </div>
          ) : (
            favoriteMenus.map((menu) => (
              <div key={menu.id} className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                  
                  {/* Image Box */}
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img 
                      src={renderImage(menu.image)} 
                      alt={menu.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>

                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h5 className="fw-bold text-success mb-0">{menu.name}</h5>
                      <FaHeart className="text-danger" />
                    </div>
                    <p className="text-muted small mb-3 text-truncate">
                      {menu.description || "Deskripsi menu tidak tersedia"}
                    </p>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="fw-bold text-success mb-0">
                        Rp {Number(menu.price).toLocaleString('id-ID')}
                      </h5>
                      <span className="badge bg-primary-subtle text-primary small px-2 py-1" 
                            style={{ backgroundColor: '#e3f2fd', fontSize: '0.7rem' }}>
                        Makanan
                      </span>
                    </div>
                    {/* Tombol Lihat Detail telah dihapus */}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <footer className="text-center py-4 text-muted small">
        © 2025 Food Delivery System
      </footer>

      <style>{`
        .btn-white:hover { background: #f1f1f1 !important; }
        .card { transition: transform 0.2s ease-in-out; }
        .card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
      `}</style>
    </div>
  );
};

export default FavoritePage;