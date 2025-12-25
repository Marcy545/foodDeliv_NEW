import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaBasketShopping, FaCartPlus, FaStar, FaMessage } from 'react-icons/fa6';
import { cartService } from '../../services/cartService';
import { orderService } from '../../services/orderService';
import { reviewService } from '../../services/reviewService';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const cartItems = location.state?.cartItems || (location.state?.menu ? [location.state.menu] : []);
  const totalAmount = location.state?.totalAmount || 0;

  const [cartCount, setCartCount] = useState(0);
  const [realReviews, setRealReviews] = useState([]); 
  const [formData, setFormData] = useState({
    customer_name: user.name || '',
    address: '', 
    payment_method: 'Transfer'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.id) {
          const data = await cartService.getCart(user.id);
          setCartCount(data ? data.length : 0);
        }
        if (cartItems.length > 0) {
          const firstMenuId = cartItems[0].id || cartItems[0].menu_id;
          const reviews = await reviewService.getReviewsByMenu(firstMenuId);
          setRealReviews(reviews || []);
        }
      } catch (err) { console.error("Checkout Fetch Error:", err); }
    };
    fetchData();
  }, [user.id, cartItems.length]);

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    if (!formData.address) return alert("Mohon isi alamat pengiriman");

    try {
      // 1. Kirim semua item ke Order Service (Port 5003)
      const orderPromises = cartItems.map(item => {
        return orderService.create({
          menu_id: item.id || item.menu_id,
          menu_name: item.name,
          image: item.image,
          customer_name: formData.customer_name,
          address: formData.address,
          quantity: parseInt(item.quantity || 1),
          total_price: item.price * (item.quantity || 1),
          status: 'Pending', 
        });
      });

      const results = await Promise.all(orderPromises);

      // 2. Gabungkan ID dari database dengan data Alamat/Nama dari Form
      const ordersWithDetails = results.map((res, index) => ({
        ...res, 
        customer_name: formData.customer_name,
        address: formData.address,
        total_price: cartItems[index].price * (cartItems[index].quantity || 1),
        menu_name: cartItems[index].name
      }));

      // 3. Hapus item dari keranjang
      const deletePromises = cartItems
        .filter(item => item.cartItemId)
        .map(item => cartService.removeFromCart(item.cartItemId));
      
      await Promise.all(deletePromises);

      if (type === 'pay') {
        // Navigasi dengan data lengkap agar PaymentPage tidak kosong
        navigate('/payment', { 
          state: { 
            orders: ordersWithDetails, 
            order: ordersWithDetails[0], 
            payment_method: formData.payment_method,
            total_payment: totalAmount 
          } 
        });
      } else {
        alert("✅ Semua pesanan berhasil dikirim!");
        navigate('/history');
      }
    } catch (err) { 
      alert("❌ Gagal memproses pesanan."); 
    }
  };

  const renderImage = (imageStr) => {
    if (!imageStr) return null;
    let cleanStr = imageStr.trim().replace(/\s/g, '');
    if (cleanStr.includes('base64,')) cleanStr = cleanStr.split('base64,').pop();
    return cleanStr.length > 50 ? `data:image/jpeg;base64,${cleanStr}` : `http://localhost:5002/storage/${cleanStr}`;
  };

  return (
    <div className="container py-5" style={{ backgroundColor: '#f6f8f5', minHeight: '100vh', fontFamily: 'Poppins' }}>
      <div className="card shadow-lg mx-auto border-0" style={{ maxWidth: '900px', borderRadius: '20px' }}>
        <div className="card-header d-flex align-items-center justify-content-between p-3 border-0" 
              style={{ background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)', color: 'white', borderRadius: '20px 20px 0 0' }}>
          <div className="d-flex align-items-center gap-2">
            <button onClick={() => navigate('/cart')} className="btn btn-light btn-sm text-success border-0 px-3 shadow-sm" style={{ fontWeight: '600' }}>
              <FaArrowLeft className="me-1" /> Kembali
            </button>
            <span className="fw-bold ms-2"><FaBasketShopping className="me-2" /> Form Pemesanan</span>
          </div>
          <button onClick={() => navigate('/cart')} className="btn btn-light btn-sm rounded-pill px-3 shadow-sm border-0 position-relative">
            <FaCartPlus className="me-1" /> Keranjang
            {cartCount > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.7rem' }}>{cartCount}</span>}
          </button>
        </div>

        <div className="card-body p-4 bg-white text-start">
          <div className="pb-3 border-bottom mb-4">
            <h6 className="fw-bold text-success mb-3">Item yang dipesan:</h6>
            {cartItems.map((item, idx) => (
              <div key={idx} className="d-flex align-items-center gap-3 mb-2 p-2 bg-light rounded-3">
                <img src={renderImage(item.image)} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} alt="" />
                <div>
                  <span className="fw-bold d-block small">{item.name}</span>
                  <small className="text-muted">{item.quantity || 1} x Rp {item.price?.toLocaleString('id-ID')}</small>
                </div>
              </div>
            ))}
          </div>

          <form className="row g-3">
            <div className="col-md-6"><label className="form-label fw-bold">Nama Pelanggan</label><input type="text" className="form-control bg-light" value={formData.customer_name} readOnly /></div>
            <div className="col-md-6"><label className="form-label fw-bold">Jumlah Menu</label><input type="text" className="form-control bg-light" value={`${cartItems.length} Jenis`} readOnly /></div>
            
            <div className="col-md-12">
              <label className="form-label fw-bold">Alamat Pengiriman</label>
              <textarea 
                className="form-control" 
                rows="2" 
                value={formData.address} 
                onChange={e => setFormData({...formData, address: e.target.value})} 
                placeholder="Masukkan alamat pengiriman..."
              ></textarea>
            </div>

            <div className="col-md-12"><label className="form-label fw-bold">Metode Pembayaran</label><select className="form-select" value={formData.payment_method} onChange={e => setFormData({...formData, payment_method: e.target.value})}><option value="Transfer">Transfer</option><option value="Cash">Cash (COD)</option></select></div>
            
            <div className="col-md-12">
              <label className="form-label fw-bold">Total Pembayaran</label>
              <input type="text" className="form-control bg-light fw-bold text-success" value={`Rp ${totalAmount.toLocaleString('id-ID')}`} readOnly />
            </div>

            <div className="col-12 d-flex justify-content-end gap-2 mt-4">
              <button type="button" onClick={() => navigate('/order')} className="btn btn-outline-secondary px-4" style={{borderRadius: '10px'}}>Ganti Menu</button>
              <button type="button" onClick={(e) => handleSubmit(e, 'order')} className="btn btn-outline-success px-4" style={{borderRadius: '10px'}}>Kirim Pesanan</button>
              <button type="button" onClick={(e) => handleSubmit(e, 'pay')} className="btn btn-success px-4 shadow-sm" style={{ backgroundColor: '#2e7d32', border: 'none', borderRadius: '10px' }}>Pesan & Bayar</button>
            </div>
          </form>

          <hr className="my-5" />
          <h5 className="text-success fw-bold mb-4 d-flex align-items-center gap-2"><FaMessage /> Ulasan Pelanggan Asli</h5>
          <div className="list-group">
            {realReviews.length > 0 ? (
              realReviews.map((review) => (
                <div key={review.id} className="list-group-item shadow-sm mb-3 p-3 border-0 bg-light" style={{ borderRadius: '12px' }}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong className="text-success">{review.customer_name}</strong>
                    <div className="d-flex gap-1 text-warning">
                      {[...Array(5)].map((_, i) => (<FaStar key={i} className={i < review.rating ? "text-warning" : "text-muted"} />))}
                    </div>
                  </div>
                  <p className="mb-1 text-muted small">{review.comment || "Tidak ada komentar."}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted small italic">Belum ada ulasan untuk menu ini.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;