import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart, FaTrash, FaSyncAlt } from 'react-icons/fa';
import { cartService } from '../../services/cartService';
import { menuService } from '../../services/menuService';

const CartPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [cart, setCart] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [cartData, menuData] = await Promise.all([
        cartService.getCart(user.id),
        menuService.getMenus()
      ]);
      setCart(cartData || []);
      setMenus(menuData || []);
    } catch (err) {
      console.error("Gagal memuat data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.id) loadData();
  }, [user.id]);

  const handleRemove = async (id) => {
    if (window.confirm("Hapus menu ini dari keranjang?")) {
      try {
        await cartService.removeFromCart(id);
        setCart(prev => prev.filter(item => item.id !== id));
        alert("✅ Item berhasil dihapus");
      } catch (err) {
        alert("Gagal menghapus: " + err.message);
      }
    }
  };

  const handleUpdateQty = async (id) => {
    const inputElement = document.getElementById(`qty-${id}`);
    const newQty = parseInt(inputElement.value);
    if (isNaN(newQty) || newQty < 1) {
      alert("Jumlah tidak valid!");
      return;
    }
    try {
      await cartService.updateCart(id, newQty);
      alert("✅ Jumlah diperbarui");
      loadData();
    } catch (err) {
      alert("❌ Gagal update: " + err.message);
    }
  };

  const getMenuDetail = (id) => menus.find(m => String(m.id) === String(id));
  
  const subtotal = cart.reduce((acc, item) => {
    const m = getMenuDetail(item.menu_id);
    return acc + (m ? m.price * item.quantity : 0);
  }, 0);

  // LOGIC PERBAIKAN: Mengirim seluruh item dengan data lengkap ke Checkout
  const handleCheckout = () => {
    if (cart.length === 0) return alert("Keranjang kosong!");

    // Gabungkan data keranjang dengan detail menu lengkap agar tidak NaN di halaman berikutnya
    const itemsToCheckout = cart.map(item => {
      const detail = getMenuDetail(item.menu_id);
      return {
        ...detail, // Menyertakan name, price, image dari menuService
        quantity: item.quantity,
        cartItemId: item.id // ID unik record keranjang untuk dihapus nanti
      };
    });

    // Kirim data ke halaman checkout
    navigate('/checkout', { 
      state: { 
        cartItems: itemsToCheckout,
        totalAmount: subtotal
      } 
    });
  };

  const renderImage = (imageStr) => {
    if (!imageStr) return null;
    let cleanStr = imageStr.trim().replace(/\s/g, '');
    if (cleanStr.includes('data:image/jpeg;base64,')) {
      cleanStr = cleanStr.split('data:image/jpeg;base64,').pop();
    }
    return cleanStr.length > 100 ? `data:image/jpeg;base64,${cleanStr}` : `http://localhost:5002/storage/${cleanStr}`;
  };

  if (loading) return <div className="text-center py-5 fw-bold text-success">Memuat Keranjang...</div>;

  return (
    <div className="container py-5" style={{ backgroundColor: '#f6f8f5', minHeight: '100vh', fontFamily: 'Poppins' }}>
      <div className="card shadow-lg mx-auto border-0" style={{ maxWidth: '1000px', borderRadius: '20px', overflow: 'hidden' }}>
        
        <div className="card-header d-flex align-items-center justify-content-between p-3 border-0" 
             style={{ background: '#2e7d32', color: 'white' }}>
          <div className="d-flex align-items-center gap-2">
            <button onClick={() => navigate('/order')} className="btn btn-light btn-sm fw-bold text-success border-0 px-3 py-2 rounded-3 shadow-sm">
              <FaArrowLeft className="me-1" /> Kembali Belanja
            </button>
            <span className="fw-bold ms-2"><FaShoppingCart className="me-2" /> Rincian Keranjang</span>
          </div>
          <span className="badge bg-white text-success rounded-pill px-3 py-2 fw-bold shadow-sm">{cart.length} Item</span>
        </div>

        <div className="card-body p-4 bg-white">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="text-muted small">
                <tr className="border-bottom text-center">
                  <th className="text-start py-3">Menu</th>
                  <th>Harga</th>
                  <th>Jumlah</th>
                  <th>Subtotal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => {
                  const m = getMenuDetail(item.menu_id);
                  if (!m) return null;
                  return (
                    <tr key={item.id} className="border-bottom text-center">
                      <td className="py-3 text-start">
                        <div className="d-flex align-items-center gap-3">
                          <div style={{ width: '55px', height: '55px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #eee' }}>
                            <img src={renderImage(m.image)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                          </div>
                          <span className="fw-bold text-dark">{m.name}</span>
                        </div>
                      </td>
                      <td>Rp {m.price.toLocaleString('id-ID')}</td>
                      <td>
                        <div className="d-inline-flex align-items-center gap-2 border rounded px-2 py-1 bg-light">
                          <input type="number" id={`qty-${item.id}`} className="form-control border-0 text-center bg-transparent p-0" style={{ width: '40px' }} defaultValue={item.quantity} min="1" />
                          <button className="btn btn-link p-0 text-success" onClick={() => handleUpdateQty(item.id)}><FaSyncAlt size={14} /></button>
                        </div>
                      </td>
                      <td className="fw-bold text-success">Rp {(m.price * item.quantity).toLocaleString('id-ID')}</td>
                      <td><button className="btn btn-link text-danger p-0" onClick={() => handleRemove(item.id)}><FaTrash size={18} /></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-end mt-4">
            <div className="checkout-box p-4" style={{ minWidth: '350px', border: '2px dashed #4caf50', borderRadius: '15px' }}>
              <div className="d-flex justify-content-between mb-2 text-muted small">
                <span>Total Pesanan:</span>
                <span className="fw-bold text-dark">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Total Akhir:</h5>
                <h3 className="fw-bold text-success mb-0">Rp {subtotal.toLocaleString('id-ID')}</h3>
              </div>
              <button onClick={handleCheckout} className="btn btn-success w-100 py-3 fw-bold shadow-sm" style={{ borderRadius: '50px', fontSize: '1.1rem' }}>
                Checkout Sekarang <i className="bi bi-chevron-right ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;