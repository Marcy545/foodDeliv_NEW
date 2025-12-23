import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaEye } from 'react-icons/fa';
import { menuService } from '../../services/menuService';

const ShowMenu = () => {
  const { id } = useParams();
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      const allMenus = await menuService.getMenus();
      const detail = allMenus.find(m => m.id === id || m.id === parseInt(id));
      setMenu(detail);
    };
    fetchMenu();
  }, [id]);

  if (!menu) return <div className="text-center p-5">Memuat data...</div>;

  return (
    <div style={{ backgroundColor: '#f6f8f5', minHeight: '100vh', padding: '60px 0' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              <img src={menu.image} style={{ height: '350px', objectFit: 'cover' }} className="w-100" />
              <div className="card-body p-4 text-start">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="fw-bold text-success mb-0">{menu.name}</h3>
                  <span className="badge rounded-pill bg-info px-3 py-2">{menu.category}</span>
                </div>
                <h4 className="fw-bold text-dark mb-4">Rp {parseInt(menu.price).toLocaleString('id-ID')}</h4>
                <p className="text-muted mb-5">{menu.description || "Tidak ada deskripsi."}</p>
                <Link to="/manage-menu" className="btn btn-success w-100 py-3 shadow">
                  <FaArrowLeft /> <span>Kembali ke Daftar Menu</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowMenu;