import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ShieldCheck, Plus, Edit, Trash2 } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Protein Supplements',
    brand: '',
    price: 1999,
    discountPrice: 1499,
    stock: 50,
    ingredients: '',
    weight: '1 kg',
    flavor: 'Chocolate',
    images: ['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500']
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.getProducts();
      if (res.success) setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      setFormData({
        name: prod.name,
        description: prod.description,
        category: prod.category,
        brand: prod.brand,
        price: prod.price,
        discountPrice: prod.discountPrice || 0,
        stock: prod.stock,
        ingredients: prod.ingredients || '',
        weight: prod.weight || '',
        flavor: prod.flavor || '',
        images: prod.images && prod.images.length > 0 ? prod.images : ['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500']
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        category: 'Protein Supplements',
        brand: '',
        price: 1999,
        discountPrice: 1499,
        stock: 50,
        ingredients: '',
        weight: '1 kg',
        flavor: 'Chocolate',
        images: ['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500']
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct._id, formData);
      } else {
        await api.createProduct(formData);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleDeactivate = async (id) => {
    if (window.confirm('Deactivate this product from store catalog?')) {
      try {
        await api.deleteProduct(id);
        fetchProducts();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <LoadingSpinner message="Loading master product inventory..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={26} color="#10b981" /> Admin Product Inventory Management
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Add new products, update prices, manage stock quantities.</p>
        </div>

        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Product Table */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem' }}>Product</th>
              <th style={{ padding: '0.75rem' }}>Category</th>
              <th style={{ padding: '0.75rem' }}>Brand</th>
              <th style={{ padding: '0.75rem' }}>Price</th>
              <th style={{ padding: '0.75rem' }}>Stock</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={p.images && p.images[0]} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>ID: #{p._id.slice(-6)}</div>
                  </div>
                </td>
                <td style={{ padding: '0.75rem' }}><span className="badge badge-emerald">{p.category}</span></td>
                <td style={{ padding: '0.75rem', color: '#9ca3af' }}>{p.brand}</td>
                <td style={{ padding: '0.75rem', fontWeight: 700 }}>₹{p.discountPrice || p.price}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span className={`badge ${p.stock > 10 ? 'badge-cyan' : 'badge-amber'}`}>
                    {p.stock} units
                  </span>
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                  <button onClick={() => handleOpenModal(p)} className="btn btn-secondary btn-sm" style={{ marginRight: '0.4rem' }}>
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDeactivate(p._id)} className="btn btn-danger btn-sm">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Product Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? 'Edit Product' : 'Add New Product'}>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Protein Supplements">Protein Supplements</option>
                <option value="Vitamins & Supplements">Vitamins & Supplements</option>
                <option value="Pre-Workout">Pre-Workout</option>
                <option value="Creatine">Creatine</option>
                <option value="Protein Bars">Protein Bars</option>
                <option value="Healthy Foods">Healthy Foods</option>
                <option value="Gym Equipment">Gym Equipment</option>
                <option value="Workout Accessories">Workout Accessories</option>
                <option value="Shakers & Bottles">Shakers & Bottles</option>
                <option value="Fitness Wear">Fitness Wear</option>
                <option value="Yoga Products">Yoga Products</option>
                <option value="Recovery Products">Recovery Products</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Brand *</label>
              <input
                type="text"
                className="form-input"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Regular Price *</label>
              <input
                type="number"
                className="form-input"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Discount Price</label>
              <input
                type="number"
                className="form-input"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stock Units *</label>
              <input
                type="number"
                className="form-input"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            {editingProduct ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      </Modal>

    </div>
  );
};

export default AdminProducts;
