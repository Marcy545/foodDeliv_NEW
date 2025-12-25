import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBasketShopping, FaCartPlus, FaHeart, FaImage } from 'react-icons/fa6';
import { cartService } from '../../services/cartService';
import { menuService } from '../../services/menuService';
import { favoriteService } from '../../services/favoriteService'; // IMPORT SERVICE FAVORITE

const CreateOrder = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [menus, setMenus] = useState([]);
  const [favorites, setFavorites] = useState([]); // STATE UNTUK DAFTAR FAVORIT
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  const fetchData = async () => {
    try {
      // AMBIL DATA MENU, CART, DAN FAVORITE SECARA PARALEL
      const [menuData, cartData, favData] = await Promise.all([
        menuService.getMenus(),
        cartService.getCart(user.id),
        favoriteService.getFavorites(user.id)
      ]);
      
      setMenus(menuData || []);
      setFavorites(favData || []); // SIMPAN DATA FAVORIT
      
      const totalItems = cartData ? cartData.reduce((acc, item) => acc + item.quantity, 0) : 0;
      setCartCount(totalItems);
    } catch (err) {
      console.error("Gagal memuat data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.id) fetchData();
  }, [user.id]);

  // FUNGSI TOGGLE FAVORITE
  const handleToggleFavorite = async (menuId) => {
    try {
      const isExist = favorites.find(f => String(f.menu_id) === String(menuId));
      
      if (isExist) {
        // Jika skema backend Anda mendukung delete, panggil fungsi delete disini.
        // Jika hanya add, tampilkan pesan bahwa sudah ada di favorit.
        alert("ℹ️ Menu ini sudah ada di daftar favorit Anda.");
      } else {
        await favoriteService.addFavorite(user.id, menuId);
        alert("❤️ Berhasil ditambah ke favorit!");
        // Refresh data favorit
        const updatedFavs = await favoriteService.getFavorites(user.id);
        setFavorites(updatedFavs);
      }
    } catch (err) {
      alert("❌ Gagal memperbarui favorit");
    }
  };

  const isMenuFavorite = (menuId) => {
    return favorites.some(f => String(f.menu_id) === String(menuId));
  };

  const renderImage = (imageStr) => {
    if (!imageStr) return null;
    let cleanStr = imageStr.trim().replace(/\s/g, '');
    if (cleanStr.includes('data:image/jpeg;base64,')) {
      cleanStr = cleanStr.split('data:image/jpeg;base64,').pop();
    }
    return cleanStr.length > 50 ? `data:image/jpeg;base64,${cleanStr}` : `http://localhost:5002/storage/${cleanStr}`;
  };

  const handleAddToCart = async (menuId) => {
    try {
      await cartService.addToCart(user.id, menuId, 1);
      alert("✅ Berhasil ditambah ke keranjang!");
      const updatedCart = await cartService.getCart(user.id);
      const totalItems = updatedCart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalItems);
    } catch (err) {
      alert("❌ Gagal: " + err.message);
    }
  };

  const handleDirectCheckout = (menu) => {
    const itemToCheckout = {
      ...menu,
      quantity: 1,
      initialQuantity: 1,
      menu_id: menu.id 
    };

    navigate('/checkout', { 
      state: { 
        cartItems: [itemToCheckout], 
        totalAmount: menu.price 
      } 
    });
  };

  if (loading) return <div className="text-center py-5 fw-bold text-success">Memuat Menu...</div>;

  return (
    <div className="container py-5" style={{ backgroundColor: '#f6f8f5', minHeight: '100vh', fontFamily: 'Poppins' }}>
      <div className="card shadow-lg mx-auto border-0" style={{ maxWidth: '850px', borderRadius: '20px' }}>
        
        <div className="card-header d-flex align-items-center justify-content-between p-3 border-0" 
             style={{ background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)', color: 'white', borderRadius: '20px 20px 0 0' }}>
          <div className="d-flex align-items-center gap-2">
            <button onClick={() => navigate('/customer-dashboard')} className="btn btn-light btn-sm text-success border-0 px-3 shadow-sm" style={{ minWidth: '100px', height: '38px !important' }}>
              <FaArrowLeft /> Kembali
            </button>
            <span className="fw-bold ms-2"><FaBasketShopping className="me-2" /> Form Pemesanan</span>
          </div>
          
          <div className="d-flex gap-2">
            <button onClick={() => navigate('/favorites')} className="btn btn-light btn-sm rounded-pill px-3 shadow-sm border-0" style={{ minWidth: '100px', height: '38px !important' }}>
               <FaHeart className="text-danger me-1" /> Favorit
            </button>
            <button onClick={() => navigate('/cart')} className="btn btn-light btn-sm rounded-pill px-3 shadow-sm border-0 position-relative" style={{ minWidth: '120px', height: '38px !important' }}>
              <FaCartPlus className="me-2" /> Keranjang
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow border border-light" style={{ fontSize: '0.7rem' }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="card-body p-4 bg-white">
          <h5 className="text-success fw-bold mb-4 d-flex align-items-center gap-2">
            <div style={{ width: '4px', height: '18px', backgroundColor: '#2e7d32', borderRadius: '2px' }}></div>
            Pilih Menu Favorit Anda:
          </h5>

          <div className="row g-3">
            {menus.map((m) => (
              <div className="col-md-12 col-lg-6" key={m.id}>
                <div className="menu-item-card p-3 border rounded-4 d-flex align-items-center justify-content-between bg-white shadow-sm">
                  
                  <div className="d-flex align-items-center gap-3">
                    <div className="img-box">
                      {m.image ? (
                        <img src={renderImage(m.image)} alt={m.name} />
                      ) : (
                        <div className="placeholder-img"><FaImage size={20} /></div>
                      )}
                    </div>
                    <div>
                      <strong className="text-success d-block fs-6 text-capitalize mb-0" style={{ lineHeight: '1.2' }}>{m.name}</strong>
                      <span className="fw-bold text-muted" style={{ fontSize: '0.85rem' }}>Rp {Number(m.price).toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center action-group">
                    {/* ICON HEART DENGAN LOGIKA TOGGLE */}
                    <FaHeart 
                      className={`heart-icon me-3 ${isMenuFavorite(m.id) ? 'active' : ''}`} 
                      title="Favorit" 
                      onClick={() => handleToggleFavorite(m.id)}
                    />
                    <button onClick={() => handleAddToCart(m.id)} className="cart-add-btn me-3" title="Tambah ke Keranjang">
                      <FaCartPlus size={18} />
                    </button>
                    <button onClick={() => handleDirectCheckout(m)} className="btn btn-outline-success btn-sm select-btn">
                      Pilih
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .menu-item-card { 
          transition: all 0.2s ease-in-out; 
          border: 1px solid #ededed !important;
        }
        .menu-item-card:hover { 
          transform: translateY(-2px); 
          border-color: #4caf50 !important; 
          box-shadow: 0 5px 15px rgba(0,0,0,0.05) !important;
        }
        
        .img-box { 
          width: 60px; 
          height: 60px; 
          border-radius: 10px; 
          overflow: hidden; 
          background: #f1f1f1; 
          flex-shrink: 0;
        }
        .img-box img { width: 100%; height: 100%; object-fit: cover; }
        
        .action-group {
          padding-left: 10px;
        }
        .heart-icon { 
          color: #ccc; 
          cursor: pointer; 
          transition: all 0.2s; 
          font-size: 1.1rem;
        }
        .heart-icon.active {
          color: #ff4d4d;
        }
        .cart-add-btn { 
          background: none; 
          border: none; 
          color: #ffa500; 
          padding: 0; 
          cursor: pointer; 
          transition: transform 0.2s;
          min-width: auto !important; 
          height: auto !important;
        }
        .heart-icon:hover, .cart-add-btn:hover { transform: scale(1.2); }

        .select-btn { 
          min-width: 70px !important; 
          height: 32px !important; 
          padding: 0 12px !important; 
          font-size: 0.8rem !important;
          border-radius: 30px !important;
          border-width: 1.5px;
        }
        
        .placeholder-img { 
          width: 100%; 
          height: 100%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: #bbb; 
        }
      `}</style>
    </div>
  );
};

export default CreateOrder;