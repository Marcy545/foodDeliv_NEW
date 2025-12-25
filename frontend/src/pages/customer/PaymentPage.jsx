import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaShieldHalved, FaReceipt, FaArrowLeft, FaCircleCheck } from 'react-icons/fa6';
import { paymentService } from '../../services/paymentService';
import { orderService } from '../../services/orderService';
import { cartService } from '../../services/cartService';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Menerima data state lengkap termasuk data alamat dan nama dari form checkout
  const { order, orders, payment_method, total_payment, cartItemId } = location.state || {};
  const [processing, setProcessing] = useState(false);

  // Proteksi data: Jika data tidak ada, tampilkan pesan error
  if (!order && (!orders || orders.length === 0)) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <h4>Data Pembayaran Tidak Ditemukan</h4>
          <button onClick={() => navigate('/order')} className="btn btn-success mt-3">Kembali ke Menu</button>
        </div>
      </div>
    );
  }

  // LOGIC PENENTUAN DATA:
  // 1. Ambil list order (prioritaskan array 'orders' jika dari keranjang)
  const ordersToPay = orders || [order];
  
  // 2. Gunakan total_payment yang dikirim eksplisit agar tidak Rp 0
  const displayTotal = total_payment || order?.total_price || 0;
  
  // 3. Nama menu yang ditampilkan
  const displayMenuName = ordersToPay.length > 1 
    ? `${ordersToPay.length} Menu dipesan` 
    : (ordersToPay[0]?.menu_name || "Menu Pesanan");

  // 4. Perbaikan Data Pengiriman (Mengambil dari objek pertama yang dikirim)
  const customerName = ordersToPay[0]?.customer_name || "Pelanggan";
  const customerAddress = ordersToPay[0]?.address || "Alamat tidak tersedia";

  const updateStatus = async () => {
    setProcessing(true);
    try {
      // Loop untuk memproses pembayaran semua ID order secara massal
      const paymentPromises = ordersToPay.map(async (item) => {
        // 1. Simpan ke Payment Service (Port 5005)
        await paymentService.processPayment({
          order_id: item.id,
          amount: Math.round(Number(item.total_price || (displayTotal / ordersToPay.length))),
          payment_method: payment_method || "Transfer"
        });

        // 2. Update status ke Order Service (Port 5003)
        const payId = `PAY-${Date.now()}-${item.id}`;
        await orderService.updateStatus(item.id, 'Paid', payId);
      });

      await Promise.all(paymentPromises);

      // 3. Hapus item dari keranjang jika ada referensi ID-nya
      if (cartItemId) await cartService.removeFromCart(cartItemId);

      alert("✅ Pembayaran Berhasil!");
      navigate('/history');
    } catch (err) {
      alert("❌ Gagal: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" 
         style={{ backgroundColor: '#f6f8f5', fontFamily: 'Poppins' }}>
      
      <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '480px', borderRadius: '30px' }}>
        <div className="card-body p-4 p-md-5 text-start">
          
          <button onClick={() => navigate(-1)} className="btn btn-link text-success p-0 mb-4 text-decoration-none d-flex align-items-center gap-2 fw-bold">
            <FaArrowLeft /> Kembali
          </button>

          <div className="text-center mb-4">
            <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-sm" 
                 style={{ width: '65px', height: '65px', backgroundColor: '#2e7d32' }}>
              <FaShieldHalved size={30} />
            </div>
            <h4 className="fw-bold text-dark mb-1">Lanjutkan Pembayaran</h4>
            <p className="text-muted small">ID Pesanan Utama: <span className="fw-bold">#ORD-{ordersToPay[0]?.id || 'N/A'}</span></p>
          </div>

          <div className="bg-white border border-light-subtle rounded-4 p-4 mb-4 shadow-sm" style={{ backgroundColor: '#fcfdfc' }}>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted small">Nama Menu</span>
              <span className="fw-bold text-dark text-capitalize text-truncate" style={{maxWidth: '200px'}}>{displayMenuName}</span>
            </div>
            <div className="d-flex justify-content-between mb-3 align-items-center">
              <span className="text-muted small">Metode</span>
              <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2" style={{ borderRadius: '10px' }}>
                {payment_method || 'Transfer'}
              </span>
            </div>
            <div className="border-top pt-3 d-flex justify-content-between align-items-center">
              <span className="fw-bold text-muted small">Total Tagihan</span>
              <h2 className="fw-bold text-success mb-0">Rp {Number(displayTotal).toLocaleString('id-ID')}</h2>
            </div>
          </div>

          <div className="mb-4 text-start">
            <label className="text-muted small fw-bold mb-2 d-flex align-items-center gap-2">
              <FaReceipt /> Detail Pengiriman:
            </label>
            <div className="p-3 bg-white border rounded-4 shadow-xs">
              <div className="fw-bold text-dark mb-1">{customerName}</div>
              <div className="text-muted small" style={{ lineHeight: '1.5' }}>{customerAddress}</div>
            </div>
          </div>

          <button 
            disabled={processing}
            onClick={updateStatus}
            className="btn btn-success w-100 py-3 fw-bold shadow mt-2" 
            style={{ borderRadius: '15px', background: '#2e7d32', border: 'none', fontSize: '1.1rem' }}
          >
            {processing ? (
              <span><span className="spinner-border spinner-border-sm me-2"></span>Memproses...</span>
            ) : (
              'Konfirmasi & Bayar'
            )}
          </button>

          <div className="text-center mt-4">
             <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
               <FaCircleCheck className="text-success me-1" /> Pembayaran aman dan terenkripsi.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;