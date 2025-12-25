import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/restaurant/Sidebar';
import { FaClipboardList, FaClock, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';
import { orderService } from '../../services/orderService'; // Pastikan path service benar

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({ name: 'Admin' });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Statistik
  const [stats, setStats] = useState({
    pending: 0,
    selesai: 0,
    total: 0
  });

  useEffect(() => {
    // 1. Proteksi Halaman
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userObj = JSON.parse(savedUser);
      if (userObj.role !== 'RESTAURANT') {
        navigate('/');
      }
      setAdmin(userObj);
    } else {
      navigate('/');
    }

    // 2. Fetch Data Orderan
    fetchOrderData();
  }, [navigate]);

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders();
      setOrders(data || []);
      
      // 3. Kalkulasi Statistik secara Real-time
      const pendingCount = data.filter(o => o.status?.toLowerCase() === 'pending').length;
      const selesaiCount = data.filter(o => 
        ['paid', 'done', 'completed', 'success'].includes(o.status?.toLowerCase())
      ).length;

      setStats({
        pending: pendingCount,
        selesai: selesaiCount,
        total: data.length
      });
    } catch (err) {
      console.error("Gagal mengambil data order:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTanggal = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "Waktu Memproses..." : d.toLocaleString('id-ID', { 
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f6f8f5', fontFamily: 'Poppins, sans-serif' }}>
      <Sidebar />
      
      <div className="flex-grow-1" style={{ marginLeft: '260px', padding: '40px' }}>
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="text-success fw-bold d-flex align-items-center gap-2 mb-1">
              <FaClipboardList /> Daftar Pesanan Masuk
            </h3>
            <p className="text-muted small mb-0">Selamat datang kembali, <strong>{admin.name}</strong></p>
          </div>
          <div className="text-end">
            <span className="badge bg-white text-muted border shadow-sm p-2 rounded-3 d-flex align-items-center gap-2">
              <FaClock className="text-success" />
              {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Statistik Cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm text-center py-4 border-start border-warning border-5 rounded-4 transition-up">
              <p className="text-muted small mb-1 fw-bold text-uppercase tracking-wider">Pending</p>
              <h2 className="fw-bold text-warning mb-0">{stats.pending}</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm text-center py-4 border-start border-success border-5 rounded-4 transition-up">
              <p className="text-muted small mb-1 fw-bold text-uppercase tracking-wider">Selesai</p>
              <h2 className="fw-bold text-success mb-0">{stats.selesai}</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm text-center py-4 border-start border-primary border-5 rounded-4 transition-up">
              <p className="text-muted small mb-1 fw-bold text-uppercase tracking-wider">Total Pesanan</p>
              <h2 className="fw-bold text-primary mb-0">{stats.total}</h2>
            </div>
          </div>
        </div>

        {/* Tabel Pesanan */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="bg-light">
                <tr className="text-muted small uppercase">
                  <th className="py-3 px-4 border-0">ID Order</th>
                  <th className="border-0">Menu</th>
                  <th className="border-0">Pelanggan</th>
                  <th className="border-0 text-center">Jumlah</th>
                  <th className="border-0">Total Harga</th>
                  <th className="border-0">Status</th>
                  <th className="border-0">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-5 text-success fw-bold">Memuat pesanan...</td></tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                       <div className="text-muted opacity-25">
                          <FaClipboardList size={60} className="mb-3" />
                          <h5 className="fw-bold mb-1">Belum ada pesanan masuk</h5>
                       </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 fw-bold text-muted small">#ORD-{order.id}</td>
                      <td className="fw-bold">{order.menu_name}</td>
                      <td>
                        <div className="fw-bold">{order.customer_name}</div>
                        <div className="text-muted small">{order.address?.substring(0, 20)}...</div>
                      </td>
                      <td className="text-center">x{order.quantity}</td>
                      <td className="fw-bold text-success">
                        Rp {Number(order.total_price).toLocaleString('id-ID')}
                      </td>
                      <td>
                        {order.status?.toLowerCase() === 'pending' ? (
                          <span className="badge bg-warning-subtle text-warning px-3 py-2 rounded-pill">
                            <FaHourglassHalf className="me-1" /> Pending
                          </span>
                        ) : (
                          <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill">
                            <FaCheckCircle className="me-1" /> Selesai
                          </span>
                        )}
                      </td>
                      <td className="text-muted small">{formatTanggal(order.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .transition-up { transition: transform 0.3s ease; }
        .transition-up:hover { transform: translateY(-5px); }
        .tracking-wider { letter-spacing: 1.5px; }
        .bg-success-subtle { background-color: #e8f5e9; }
        .bg-warning-subtle { background-color: #fff8e1; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;