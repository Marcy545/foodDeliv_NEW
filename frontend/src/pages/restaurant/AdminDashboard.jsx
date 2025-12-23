import React from 'react';
import Sidebar from '../../components/restaurant/Sidebar';
import { FaClipboardList } from 'react-icons/fa';

const AdminDashboard = () => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f6f8f5' }}>
      {/* Sidebar tetap di kiri */}
      <Sidebar />
      
      {/* Area Konten Utama */}
      <div className="flex-grow-1" style={{ marginLeft: '260px', padding: '40px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-success fw-bold d-flex align-items-center gap-2">
            <FaClipboardList /> Daftar Pesanan Masuk
          </h3>
          <span className="text-muted small">Diperbarui 23 Dec 2025, 17:17</span>
        </div>

        {/* Statistik Cards dengan Border Samping */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm text-center py-3 border-start border-warning border-4 rounded-3">
              <p className="text-muted small mb-1 fw-bold tracking-wider">PENDING</p>
              <h2 className="fw-bold text-warning mb-0">0</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm text-center py-3 border-start border-success border-4 rounded-3">
              <p className="text-muted small mb-1 fw-bold tracking-wider">SELESAI</p>
              <h2 className="fw-bold text-success mb-0">0</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm text-center py-3 border-start border-primary border-4 rounded-3">
              <p className="text-muted small mb-1 fw-bold tracking-wider">TOTAL PESANAN</p>
              <h2 className="fw-bold text-primary mb-0">0</h2>
            </div>
          </div>
        </div>

        {/* Tabel Pesanan */}
        <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
          <table className="table align-middle mb-0">
            <thead className="bg-light text-muted small uppercase">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th>Menu</th>
                <th>Pelanggan</th>
                <th className="text-center">Jumlah</th>
                <th>Total</th>
                <th>Status</th>
                <th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="7" className="text-center py-5">
                   <div className="text-muted opacity-50">
                      <FaClipboardList size={40} className="mb-2" />
                      <p className="mb-0">Belum ada pesanan masuk.</p>
                   </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;