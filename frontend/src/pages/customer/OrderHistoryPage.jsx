import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaClockRotateLeft, 
  FaFileInvoice, 
  FaStar, 
  FaMessage,
  FaCreditCard,
  FaLocationDot
} from 'react-icons/fa6';
import { orderService } from '../../services/orderService';
import { reviewService } from '../../services/reviewService';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [groupedOrders, setGroupedOrders] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // State Review
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewedOrders, setReviewedOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // 1. Ambil semua data pesanan
      const data = await orderService.getOrders();
      const userOrders = data.filter(o => String(o.customer_name) === String(user.name));

      // 2. LOGIKA GROUPING: Menggabungkan baris DB berdasarkan created_at
      const groups = userOrders.reduce((acc, curr) => {
        const timestamp = curr.created_at;
        if (!acc[timestamp]) {
          acc[timestamp] = {
            id: curr.id,
            created_at: curr.created_at,
            status: curr.status,
            customer_name: curr.customer_name,
            address: curr.address, 
            items: [],
            grand_total: 0
          };
        }
        acc[timestamp].items.push(curr);
        acc[timestamp].grand_total += Number(curr.total_price);
        return acc;
      }, {});

      // Urutkan dari transaksi yang paling baru
      const sortedGroups = Object.values(groups).sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      
      setGroupedOrders(sortedGroups);

      // 3. Ambil data review untuk sinkronisasi tombol
      try {
        const allReviews = await reviewService.getReviewsByMenu("all");
        const reviewedIds = allReviews
          .filter(r => r.customer_name === user.name)
          .map(r => String(r.order_id));
        setReviewedOrders(reviewedIds);
      } catch (revErr) {
        console.warn("Gagal sinkron status ulasan.");
      }

    } catch (err) { 
      console.error("Gagal memuat riwayat:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (user.name) fetchOrders();
  }, [user.name]);

  const handleSendReview = async () => {
    if (!selectedOrder) return;

    // Proteksi: Pastikan menu_id tidak undefined sebelum dikirim ke database
    const targetMenuId = selectedOrder.menu_id || selectedOrder.id;
    if (!targetMenuId || targetMenuId === 'undefined') {
      return alert("❌ Error: ID Menu tidak valid. Silakan coba lagi.");
    }

    try {
      await reviewService.addReview({
        order_id: selectedOrder.id,
        menu_id: targetMenuId, 
        menu_name: selectedOrder.menu_name,
        quantity: selectedOrder.quantity || 1,
        customer_name: user.name,
        rating: rating,
        comment: comment
      });

      alert("✅ Ulasan berhasil dikirim!");
      
      // Menutup modal ulasan
      const closeBtn = document.querySelector('#reviewModal .btn-close');
      if (closeBtn) closeBtn.click();
      
      setComment("");
      setRating(5);
      fetchOrders(); 
    } catch (err) {
      alert("❌ Gagal: " + err.message);
    }
  };

  const formatTanggal = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleString('id-ID', { 
      day: '2-digit', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    }) + " WIB";
  };

  const renderImage = (imageStr) => {
    if (!imageStr) return null;
    let cleanStr = imageStr.trim().replace(/\s/g, '');
    if (cleanStr.includes('base64,')) cleanStr = cleanStr.split('base64,').pop();
    return cleanStr.length > 100 
      ? `data:image/jpeg;base64,${cleanStr}` 
      : `http://localhost:5002/storage/${cleanStr}`;
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === 'pending') return <span className="badge bg-warning-subtle text-warning px-3 py-2">Menunggu</span>;
    if (['paid', 'done', 'completed', 'success', 'selesai'].includes(s)) 
      return <span className="badge bg-success-subtle text-success px-3 py-2">Selesai</span>;
    return <span className="badge bg-secondary-subtle text-secondary px-3 py-2">{status}</span>;
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
      <div className="spinner-border text-success" role="status"></div>
    </div>
  );

  return (
    <div className="history-page py-4 text-start" style={{ background: '#f8fafb', minHeight: '100vh', fontFamily: 'Poppins' }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-success border-start border-4 border-success ps-3">
            <FaFileInvoice className="me-2" /> History Pesanan
          </h2>
          <button onClick={() => navigate('/order')} className="btn btn-outline-success rounded-pill px-4 fw-bold shadow-sm" style={{ background: '#fff' }}>
            <FaArrowLeft className="me-2" /> Kembali Belanja
          </button>
        </div>

        {groupedOrders.length === 0 ? (
          <div className="text-center py-5 opacity-50">
            <FaFileInvoice size={80} className="mb-3" />
            <h4>Belum Ada Pesanan</h4>
          </div>
        ) : (
          groupedOrders.map((group, index) => (
            <div key={index} className="card border-0 shadow-sm mb-4" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              
              <div className="card-header bg-white border-bottom border-dashed d-flex justify-content-between p-3">
                <div>
                  <small className="text-muted d-block small">Waktu Transaksi</small>
                  <span className="fw-bold">{formatTanggal(group.created_at)}</span>
                </div>
                <div>{getStatusBadge(group.status)}</div>
              </div>
              
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead className="bg-light small text-muted text-uppercase">
                      <tr>
                        <th className="ps-4 py-3">Item Menu</th>
                        <th className="text-center">Jumlah</th>
                        <th className="text-end pe-4">Subtotal</th>
                        <th className="text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.items.map((item) => (
                        <tr key={item.id} className="border-bottom">
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center gap-3">
                              <div className="rounded shadow-sm overflow-hidden" style={{ width: '50px', height: '50px' }}>
                                <img src={renderImage(item.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              <span className="fw-bold">{item.menu_name}</span>
                            </div>
                          </td>
                          <td className="text-center fw-bold">x{item.quantity}</td>
                          <td className="text-end pe-4 fw-bold text-success">Rp {Number(item.total_price).toLocaleString('id-ID')}</td>
                          <td className="text-center">
                            {group.status?.toLowerCase() === 'pending' ? (
                              <button className="btn btn-warning btn-sm text-white rounded-pill px-3" onClick={() => navigate('/payment', { state: { order: item, payment_method: 'Transfer' } })}>
                                <FaCreditCard size={12} className="me-1" /> Bayar
                              </button>
                            ) : (
                              <button 
                                disabled={reviewedOrders.includes(String(item.id))}
                                className={`btn ${reviewedOrders.includes(String(item.id)) ? 'btn-secondary' : 'btn-outline-success'} btn-sm rounded-pill px-3`}
                                data-bs-toggle="modal" data-bs-target="#reviewModal" 
                                onClick={() => setSelectedOrder(item)}
                              >
                                <FaStar size={12} className="me-1" /> 
                                {reviewedOrders.includes(String(item.id)) ? 'Diulas' : 'Review'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card-footer bg-white p-3 d-flex justify-content-between align-items-center border-top">
                <div className="small">
                  <FaLocationDot className="text-danger me-1" /> 
                  <span className="text-muted">Kirim ke: </span>
                  <span className="fw-medium text-dark">{group.address || "Alamat tidak tersedia"}</span>
                </div>
                <div className="text-end">
                  <small className="text-muted d-block">Total Pembayaran</small>
                  <h4 className="fw-bold text-success mb-0">Rp {group.grand_total.toLocaleString('id-ID')}</h4>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Review */}
      <div className="modal fade" id="reviewModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
            <div className="modal-header text-white" style={{ background: '#2e7d32', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
              <h5 className="modal-title fw-bold"><FaMessage className="me-2" /> Beri Ulasan</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body p-4 text-center">
              <h5 className="fw-bold text-success mb-4">{selectedOrder?.menu_name}</h5>
              <div className="d-flex justify-content-center gap-2 mb-4 fs-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} style={{ cursor: 'pointer', color: star <= rating ? '#ffc107' : '#e4e5e9' }} onClick={() => setRating(star)} />
                ))}
              </div>
              <textarea className="form-control bg-light rounded-3 border-0" rows="3" placeholder="Bagaimana rasa makanannya?..." value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
            </div>
            <div className="modal-footer border-0 p-4 pt-0">
              <button type="button" className="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Batal</button>
              <button type="button" className="btn btn-success rounded-pill px-4 shadow" style={{ background: '#2e7d32' }} onClick={handleSendReview}>Kirim Ulasan</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .badge { border-radius: 8px !important; }
        .bg-success-subtle { background-color: #e8f5e9 !important; color: #2e7d32 !important; }
        .bg-warning-subtle { background-color: #fff8e1 !important; color: #f57f17 !important; }
        .border-dashed { border-bottom-style: dashed !important; }
      `}</style>
    </div>
  );
};

export default OrderHistoryPage;