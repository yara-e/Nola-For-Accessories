'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { getPaginatedProducts, createProduct, updateProduct, deleteProduct } from '@/actions/productActions';
import { getCategories } from '@/actions/categoryActions';
import { Plus, Edit, Trash2, Upload, Loader2, X, Tag, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [formData, setFormData] = useState({
    nameEn: '',
    nameAr: '',
    descEn: '',
    descAr: '',
    price: '',
    qty: '',
    category: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string>('');

  useEffect(() => {
    fetchData(currentPage, selectedCategoryFilter);
  }, [currentPage, selectedCategoryFilter]);

  const fetchData = async (page: number, categoryId?: string) => {
    setLoading(true);
    const catParam = categoryId === 'all' ? undefined : categoryId;
    const [prodRes, catRes] = await Promise.all([
      getPaginatedProducts(page, catParam),
      getCategories(),
    ]);

    setProducts(prodRes?.products || []);
    setTotalPages(prodRes?.totalPages || 1);

    const catData = catRes as any;
    const catList = Array.isArray(catData)
      ? catData
      : Array.isArray(catData?.categories)
      ? catData.categories
      : Array.isArray(catData?.data)
      ? catData.data
      : [];

    setCategories(catList);
    setLoading(false);
  };

  const handleCategoryFilterChange = (catId: string) => {
    setSelectedCategoryFilter(catId);
    setCurrentPage(1);
  };

  const getCategoryName = (category: any) => {
    if (!category) return '—';
    const catArray = Array.isArray(categories) ? categories : [];
    if (typeof category === 'string') {
      const found = catArray.find((c) => c._id === category || c.id === category);
      return found?.name?.en || found?.name?.ar || found?.name || category;
    }
    return category.name?.en || category.name?.ar || category.name || '—';
  };

  const getCategoryObjId = (category: any) => {
    if (!category) return '';
    if (typeof category === 'string') return category;
    return category._id || category.id || '';
  };

  const openModal = (product?: any) => {
    if (product) {
      setEditingId(product._id);
      setFormData({
        nameEn: product.name?.en || '',
        nameAr: product.name?.ar || '',
        descEn: product.description?.en || '',
        descAr: product.description?.ar || '',
        price: product.price !== undefined ? String(product.price) : '',
        qty: product.stock !== undefined ? String(product.stock) : '',
        category: getCategoryObjId(product.category),
      });
      setExistingImage(product.image || product.images?.[0] || '/placeholder.svg');
    } else {
      setEditingId(null);
      setFormData({ nameEn: '', nameAr: '', descEn: '', descAr: '', price: '', qty: '', category: '' });
      setExistingImage('');
    }
    setFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append('nameEn', formData.nameEn);
    data.append('nameAr', formData.nameAr);
    data.append('descEn', formData.descEn);
    data.append('descAr', formData.descAr);
    data.append('price', formData.price);
    data.append('qty', formData.qty);
    data.append('category', formData.category);

    if (file) {
      data.append('image', file);
    }

    if (editingId) {
      await updateProduct(editingId, data);
    } else {
      await createProduct(data);
    }

    setSubmitting(false);
    setModalOpen(false);
    fetchData(currentPage, selectedCategoryFilter);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      fetchData(currentPage, selectedCategoryFilter);
    }
  };

  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1B3D]">Products</h1>
            <p className="text-xs text-gray-500 mt-1">Manage storefront items and inventory</p>
          </div>

          <button
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 bg-[#5C3D6A] hover:bg-[#482D54] text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        {/* CATEGORY FILTER CHIPS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none bg-white p-3 rounded-2xl border-2 border-[#D8CDE0] shadow-sm">
          <button
            onClick={() => handleCategoryFilterChange('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategoryFilter === 'all'
                ? 'bg-[#5C3D6A] text-white shadow-sm'
                : 'bg-[#FAF9F6] text-[#3D3442] hover:bg-[#EFECE8] border border-[#E0D7E5]'
            }`}
          >
            All Products
          </button>

          {safeCategories.map((c) => {
            const catId = c._id || c.id;
            const isActive = selectedCategoryFilter === catId;

            return (
              <button
                key={catId}
                onClick={() => handleCategoryFilterChange(catId)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#5C3D6A] text-white shadow-sm'
                    : 'bg-[#FAF9F6] text-[#3D3442] hover:bg-[#EFECE8] border border-[#E0D7E5]'
                }`}
              >
                {c.name?.en || c.name?.ar || c.name}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#80608E]" />
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-[#D8CDE0] p-8 sm:p-12 text-center space-y-3">
            <Tag className="w-10 h-10 text-[#80608E] mx-auto opacity-40" />
            <h3 className="font-serif text-xl font-bold text-[#2A1B3D]">No Products Found</h3>
            <p className="text-xs text-gray-500">There are no products in this category yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* SCROLLABLE TABLE CONTAINER FOR MOBILE & DESKTOP */}
            <div className="bg-white rounded-3xl border-2 border-[#D8CDE0] overflow-hidden shadow-sm">
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#D8CDE0]">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="bg-[#FAF9F6] border-b border-[#E5DCEB] text-xs font-bold text-[#80608E] uppercase whitespace-nowrap">
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5DCEB] text-xs font-semibold text-[#2A1B3D] whitespace-nowrap">
                    {products.map((p) => (
                      <tr key={p._id} className="hover:bg-[#FAF9F6]/50">
                        <td className="p-4 flex items-center gap-3 min-w-[200px]">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border shrink-0">
                            <Image src={p.image || p.images?.[0] || '/placeholder.svg'} alt="" fill className="object-cover" />
                          </div>
                          <span className="font-bold truncate">{p.name?.en || p.name}</span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F5FB] border border-[#E0D7E5] text-[11px] font-bold text-[#80608E]">
                            <Tag className="w-3 h-3" />
                            {getCategoryName(p.category)}
                          </span>
                        </td>
                        <td className="p-4 font-serif text-sm font-bold text-[#5C3D6A]">EGP {p.price}</td>
                        <td className="p-4">{p.stock ?? 0}</td>
                        <td className="p-4 text-right space-x-2 rtl:space-x-reverse">
                          <button onClick={() => openModal(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(p._id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-4 sm:px-6 py-4 rounded-2xl border-2 border-[#D8CDE0]">
                <span className="text-xs font-bold text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="p-2 rounded-xl border border-[#E5DCEB] bg-[#FAF9F6] hover:bg-[#EFECE8] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#2A1B3D]" />
                  </button>

                  <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] sm:max-w-none">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold shrink-0 transition-all ${
                          page === currentPage
                            ? 'bg-[#5C3D6A] text-white shadow-sm'
                            : 'bg-[#FAF9F6] border border-[#E5DCEB] text-[#2A1B3D] hover:bg-[#EFECE8]'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="p-2 rounded-xl border border-[#E5DCEB] bg-[#FAF9F6] hover:bg-[#EFECE8] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4 text-[#2A1B3D]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* RESPONSIVE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-5 sm:p-8 border-2 border-[#D8CDE0] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1B3D]">
                {editingId ? 'Edit Product' : 'Create Product'}
              </h2>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-[#3D3442]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Name (English)</label>
                  <input
                    required
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full p-3 bg-[#FAF9F6] border border-[#E0D7E5] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block mb-1">Name (Arabic)</label>
                  <input
                    required
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className="w-full p-3 bg-[#FAF9F6] border border-[#E0D7E5] rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Description (English)</label>
                  <textarea
                    rows={2}
                    value={formData.descEn}
                    onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                    className="w-full p-3 bg-[#FAF9F6] border border-[#E0D7E5] rounded-xl resize-none"
                  />
                </div>
                <div>
                  <label className="block mb-1">Description (Arabic)</label>
                  <textarea
                    rows={2}
                    value={formData.descAr}
                    onChange={(e) => setFormData({ ...formData, descAr: e.target.value })}
                    className="w-full p-3 bg-[#FAF9F6] border border-[#E0D7E5] rounded-xl resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1">Price (EGP)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-3 bg-[#FAF9F6] border border-[#E0D7E5] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.qty}
                    onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                    className="w-full p-3 bg-[#FAF9F6] border border-[#E0D7E5] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block mb-1">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 bg-[#FAF9F6] border border-[#E0D7E5] rounded-xl"
                  >
                    <option value="">Select Category</option>
                    {safeCategories.map((c) => (
                      <option key={c._id || c.id} value={c._id || c.id}>
                        {c.name?.en || c.name?.ar || c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Image Section */}
              <div>
                <label className="block mb-2 text-gray-600">Product Image</label>
                {existingImage && !file && (
                  <div className="mb-3 relative w-24 h-24 rounded-xl overflow-hidden border border-[#D8CDE0]">
                    <Image src={existingImage} alt="Current Product" fill className="object-cover" />
                  </div>
                )}
                <div className="relative border-2 border-dashed border-[#E0D7E5] rounded-2xl p-6 text-center bg-[#FAF9F6]">
                  <Upload className="w-6 h-6 text-[#80608E] mx-auto mb-2" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <span>{file ? file.name : 'Click or drop a new image here'}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#5C3D6A] text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#482D54] transition-colors"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}