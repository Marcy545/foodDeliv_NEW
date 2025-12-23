import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaPencilAlt, FaArrowLeft, FaSave, FaImage } from 'react-icons/fa';
import { menuService } from '../../services/menuService';

const EditMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '' 
  });

  // Load data menu lama saat halaman dibuka agar form terisi otomatis
  useEffect(() => {
    const fetchMenuDetail = async () => {
      try {
        const allMenus = await menuService.getMenus();
        // Cari data berdasarkan ID dari URL
        const currentMenu = allMenus.find(m => String(m.id) === String(id));
        
        if (currentMenu) {
          setFormData({
            name: currentMenu.name,
            description: currentMenu.description,
            price: currentMenu.price,
            category: currentMenu.category,
            image: currentMenu.image
          });
          setPreview(currentMenu.image);
        }
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    };
    fetchMenuDetail();
  }, [id]);

  // Fungsi preview gambar (Base64) - Sama dengan AddMenu
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // LOGIKA: Memanggil updateMenu dengan ID
      await menuService.updateMenu(id, formData);
      alert("✅ Menu berhasil diperbarui!");
      navigate('/manage-menu');
    } catch (error) {
      alert("❌ Gagal update: " + error.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#f6f8f5', minHeight: '100vh', padding: '60px 0' }}>
      <div className="container text-start">
        <div className="row justify-content-center">
          <div className="col-md-7">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              {/* Header warna kuning/orange untuk membedakan dengan Add (Hijau) */}
              <div className="card-header border-0 p-3 bg-warning text-dark">
                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                  <FaPencilAlt /> Edit Menu Produk
                </h5>
              </div>

              <div className="card-body p-4 bg-white">
                <form onSubmit={handleSubmit}>
                  {/* Preview Area */}
                  <div className="mb-4 text-center">
                    <div className="rounded-4 border bg-light mx-auto d-flex align-items-center justify-content-center" 
                         style={{ width: '100%', height: '220px', overflow: 'hidden', borderStyle: 'dashed' }}>
                      {preview ? (
                        <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <FaImage size={45} className="opacity-25" />
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="fw-bold small text-muted">Nama Menu</label>
                    <input type="text" className="form-control bg-light border-0 py-2" value={formData.name} required 
                           onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <label className="fw-bold small text-muted">Harga (Rp)</label>
                      <input type="number" className="form-control bg-light border-0 py-2" value={formData.price} required 
                             onChange={(e) => setFormData({...formData, price: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="fw-bold small text-muted">Kategori</label>
                      <select className="form-select bg-light border-0 py-2" value={formData.category} required 
                              onChange={(e) => setFormData({...formData, category: e.target.value})}>
                        <option value="Makanan">Makanan</option>
                        <option value="Minuman">Minuman</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="fw-bold small text-muted">Ganti Gambar (Opsional)</label>
                    <input type="file" className="form-control border-0 bg-light py-2" accept="image/*" 
                           onChange={handleImageChange} />
                  </div>

                  <div className="mb-4">
                    <label className="fw-bold small text-muted">Deskripsi</label>
                    <textarea className="form-control bg-light border-0" rows="3" value={formData.description}
                              onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>

                  {/* Button Section - Pill Style & Centered Text */}
                  <div className="d-flex gap-3 mt-4">
                    <button type="submit" className="btn btn-warning flex-grow-1 rounded-pill fw-bold border-0 shadow py-2 d-flex align-items-center justify-content-center gap-2">
                      <FaSave /> <span>Update Menu</span>
                    </button>
                    <Link to="/manage-menu" className="btn btn-secondary px-4 rounded-pill fw-bold border-0 py-2 text-decoration-none d-flex align-items-center justify-content-center gap-2">
                      <FaArrowLeft /> <span>Batal</span>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMenu;