import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/restaurant/Sidebar';
import { FaListUl, FaPlus, FaEye, FaPencilAlt, FaTrash, FaInbox } from 'react-icons/fa';
import { menuService } from '../../services/menuService';

const MenuManagement = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await menuService.getMenus();
      setMenus(data || []);
    } catch (err) {
      console.error("Gagal memuat data menu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus menu ini?")) {
      try {
        await menuService.deleteMenu(id);
        alert("✅ Menu berhasil dihapus!");
        loadData(); 
      } catch (err) {
        alert("❌ Gagal menghapus: " + err.message);
      }
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar tetap di sisi kiri */}
      <Sidebar />
      
      {/* Konten Utama */}
      <div className="flex-grow-1" style={{ marginLeft: '260px', padding: '40px' }}>
        
        {/* Header Bagian Atas */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h3 className="fw-bold text-success m-0">
            <FaListUl className="me-3" /> Kelola Menu
          </h3>
          <Link to="/add-menu" className="btn btn-success text-decoration-none shadow px-4 rounded-pill">
            <FaPlus className="me-2" /> <span>Tambah Menu</span>
          </Link>
        </div>

        <div className="row g-4 text-start">
          {loading ? (
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : menus.length > 0 ? (
            menus.map((menu) => (
              <div className="col-md-4" key={menu.id}>
                <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100">
                  <img 
                    src={menu.image} 
                    style={{ height: '180px', objectFit: 'cover' }} 
                    className="w-100" 
                    alt={menu.name} 
                  />
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-1">{menu.name}</h5>
                    <p className="text-muted small mb-3 text-truncate">{menu.description}</p>
                    <h6 className="text-success fw-bold mb-4">
                      Rp {parseInt(menu.price).toLocaleString('id-ID')}
                    </h6>
                    
                    {/* Tombol Aksi */}
                    <div className="d-flex gap-2">
                      <Link to={`/show-menu/${menu.id}`} className="btn btn-outline-success flex-grow-1 rounded-pill">
                        <FaEye />
                      </Link>
                      <Link to={`/edit-menu/${menu.id}`} className="btn btn-outline-warning flex-grow-1 rounded-pill">
                        <FaPencilAlt />
                      </Link>
                      <button 
                        onClick={() => handleDelete(menu.id)} 
                        className="btn btn-outline-danger flex-grow-1 rounded-pill"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 d-flex flex-column align-items-center justify-content-center py-5 mt-5">
              <FaInbox size={80} className="text-muted mb-3 opacity-25" />
              <h4 className="fw-bold text-muted">Menu Belum Tersedia</h4>
              <p className="text-muted small">Silakan tambahkan produk baru melalui tombol di atas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;