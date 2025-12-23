import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlusCircle, FaArrowLeft, FaSave, FaImage } from 'react-icons/fa';
import { menuService } from '../../services/menuService';

const AddMenu = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', image: ''
  });

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
      // LOGIC: addMenu (tanpa ID)
      await menuService.addMenu(formData);
      alert("✅ Menu baru berhasil disimpan!");
      navigate('/manage-menu');
    } catch (error) {
      alert("❌ Gagal: " + error.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#f6f8f5', minHeight: '100vh', padding: '60px 0' }}>
      <div className="container text-start">
        <div className="row justify-content-center">
          <div className="col-md-7">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-header border-0 p-3 bg-success text-white">
                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                  <FaPlusCircle /> Tambah Menu Baru
                </h5>
              </div>
              <div className="card-body p-4 bg-white">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4 text-center">
                    <div className="rounded-4 border bg-light mx-auto d-flex align-items-center justify-content-center" 
                         style={{ width: '100%', height: '220px', overflow: 'hidden', borderStyle: 'dashed' }}>
                      {preview ? <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FaImage size={45} className="opacity-25" />}
                    </div>
                  </div>
                  {/* Form input sama seperti EditMenu ... */}
                  <div className="mb-3">
                    <label className="fw-bold small text-muted">Nama Menu</label>
                    <input type="text" className="form-control bg-light border-0 py-2" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="fw-bold small text-muted">Harga (Rp)</label>
                      <input type="number" className="form-control bg-light border-0 py-2" required onChange={(e) => setFormData({...formData, price: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="fw-bold small text-muted">Kategori</label>
                      <select className="form-select bg-light border-0 py-2" required onChange={(e) => setFormData({...formData, category: e.target.value})}>
                        <option value="">-- Pilih --</option>
                        <option value="Makanan">Makanan</option>
                        <option value="Minuman">Minuman</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold small text-muted">Upload Gambar</label>
                    <input type="file" className="form-control border-0 bg-light" accept="image/*" onChange={handleImageChange} required />
                  </div>
                  <div className="mb-4">
                    <label className="fw-bold small text-muted">Deskripsi</label>
                    <textarea className="form-control bg-light border-0" rows="3" onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>
                  <div className="d-flex gap-3">
                    <button type="submit" className="btn btn-success flex-grow-1 rounded-pill fw-bold border-0 shadow py-2 d-flex align-items-center justify-content-center gap-2">
                      <FaSave /> <span>Simpan Menu</span>
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

export default AddMenu;