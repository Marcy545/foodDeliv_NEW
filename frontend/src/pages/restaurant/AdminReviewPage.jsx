import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/restaurant/Sidebar';
import { FaStar, FaMessage, FaUser, FaUtensils, FaHashtag } from 'react-icons/fa6';
import { reviewService } from '../../services/reviewService';

const AdminReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        setLoading(true);
        // Mengambil seluruh ulasan menggunakan parameter "all"
        const data = await reviewService.getReviewsByMenu("all"); 
        setReviews(data || []);
      } catch (err) {
        console.error("Gagal memuat ulasan:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllReviews();
  }, []);

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f6f8f5', fontFamily: 'Poppins' }}>
      <Sidebar />
      
      <div className="flex-grow-1" style={{ marginLeft: '260px', padding: '40px' }}>
        <h3 className="text-success fw-bold mb-4 d-flex align-items-center gap-2 text-start">
          <FaMessage /> Manajemen Ulasan Pelanggan
        </h3>

        <div className="row g-4">
          {loading ? (
            <div className="col-12 text-center py-5 text-success fw-bold">Memuat ulasan...</div>
          ) : reviews.length === 0 ? (
            <div className="col-12 text-center py-5 opacity-50">
              <FaMessage size={50} className="mb-3" />
              <h5>Belum ada ulasan yang masuk.</h5>
            </div>
          ) : (
            reviews.map((rev) => (
              <div className="col-md-6" key={rev.id}>
                <div className="card border-0 shadow-sm rounded-4 p-4 h-100 transition-up bg-white">
                  
                  {/* Header: Info Pelanggan & Rating */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '48px', height: '48px' }}>
                        <FaUser size={20} />
                      </div>
                      <div className="text-start">
                        <h6 className="fw-bold mb-0 text-dark">{rev.customer_name}</h6>
                        <small className="text-muted d-flex align-items-center gap-1">
                          <FaHashtag size={10} className="text-success" /> 
                          ID Order: <strong>#{rev.order_id}</strong>
                        </small>
                      </div>
                    </div>
                    <div className="text-warning d-flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < rev.rating ? "text-warning" : "text-muted opacity-25"} />
                      ))}
                    </div>
                  </div>

                  {/* Detail Item Menu (Per Item walau 1 Order ID) */}
                  <div className="bg-light p-3 rounded-3 mb-3 text-start border-start border-success border-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <FaUtensils size={14} className="text-success" />
                        <span className="fw-bold text-success" style={{ fontSize: '0.9rem' }}>
                          {rev.menu_name || "Menu Tidak Diketahui"}
                        </span>
                      </div>
                      <span className="badge bg-success-subtle text-success rounded-pill px-2 py-1" style={{ fontSize: '0.7rem' }}>
                        {rev.quantity || 0} Porsi
                      </span>
                    </div>
                  </div>

                  {/* Isi Komentar Pelanggan */}
                  <div className="text-start p-3 rounded-3" style={{ background: '#f9f9f9', border: '1px solid #eee' }}>
                    <small className="text-muted d-block mb-1 fw-bold text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>Komentar:</small>
                    <p className="text-dark mb-0 fst-italic" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                      "{rev.comment || 'Pelanggan tidak memberikan komentar'}"
                    </p>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .transition-up { 
          transition: all 0.3s ease; 
          border: 1px solid transparent;
        }
        .transition-up:hover { 
          transform: translateY(-5px); 
          box-shadow: 0 10px 20px rgba(46, 125, 50, 0.1) !important;
          border-color: #a5d6a7;
        }
        .bg-success-subtle {
          background-color: #e8f5e9 !important;
          color: #2e7d32 !important;
        }
      `}</style>
    </div>
  );
};

export default AdminReviewPage;