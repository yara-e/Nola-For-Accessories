'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/actions/categoryActions';
import { useAdminLanguage } from '@/app/admin/AdminLanguageContext'; // Adjust path if needed
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  X,
  Image as ImageIcon,
  Upload,
  AlertCircle,
} from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const translations = {
  en: {
    title: 'Categories',
    addCategory: 'Add Category',
    editCategory: 'Edit Category',
    createCategory: 'Create Category',
    colCategory: 'Category',
    colActions: 'Actions',
    noCategories: 'No categories found. Click "Add Category" to create one.',
    nameEn: 'Name (English)',
    nameAr: 'Name (Arabic)',
    categoryImage: 'Category Image',
    chooseImage: 'Choose image file',
    save: 'Save',
    saving: 'Saving...',
    fileSizeError: 'The image size is too large (max 5MB)',
    fetchError: 'Failed to fetch categories.',
    unexpectedError: 'An unexpected server error occurred while loading categories.',
    saveError: 'Failed to save category.',
    serverError: 'Server error (500): Something went wrong on the server.',
    deleteConfirm: 'Are you sure you want to delete this category?',
    deleteError: 'Failed to delete category.',
    deleteServerError: 'Server error (500): Could not delete category.',
    edit: 'Edit',
    delete: 'Delete',
  },
  ar: {
    title: 'الأقسام',
    addCategory: 'إضافة قسم',
    editCategory: 'تعديل القسم',
    createCategory: 'إنشاء قسم',
    colCategory: 'القسم',
    colActions: 'الإجراءات',
    noCategories: 'لم يتم العثور على أقسام. انقر على "إضافة قسم" لإنشاء قسم جديد.',
    nameEn: 'الاسم (بالإنجليزية)',
    nameAr: 'الاسم (بالعربية)',
    categoryImage: 'صورة القسم',
    chooseImage: 'اختر ملف الصورة',
    save: 'حفظ',
    saving: 'جاري الحفظ...',
    fileSizeError: 'حجم الصورة كبير جداً (الحد الأقصى 5 ميجابايت)',
    fetchError: 'فشل في جلب الأقسام.',
    unexpectedError: 'حدث خطأ غير متوقع أثناء تحميل الأقسام.',
    saveError: 'فشل في حفظ القسم.',
    serverError: 'خطأ في الخادم (500): حدث خطأ ما على الخادم.',
    deleteConfirm: 'هل أنت تأكد من رغبتك في حذف هذا القسم؟',
    deleteError: 'فشل في حذف القسم.',
    deleteServerError: 'خطأ في الخادم (500): تعذر حذف القسم.',
    edit: 'تعديل',
    delete: 'حذف',
  },
};

export default function AdminCategoriesPage() {
  const { lang } = useAdminLanguage();
  const t = translations[lang];

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  // Modal & Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nameEn: '', nameAr: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setPageError(null);
    try {
      const res = await getCategories();
      if (res.success) {
        setCategories(res.data || []);
      } else {
        setPageError(res.error || t.fetchError);
      }
    } catch (err) {
      console.error('Error in fetchData:', err);
      setPageError(t.unexpectedError);
    } finally {
      setLoading(false);
    }
  }, [t.fetchError, t.unexpectedError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const closeModal = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl('');
    setExistingImage('');
    setModalError(null);
  };

  const openModal = (category?: any) => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setModalError(null);

    if (category) {
      setEditingId(category._id);
      setFormData({
        nameEn: category.name?.en || '',
        nameAr: category.name?.ar || '',
      });
      setExistingImage(category.image || '');
      setPreviewUrl(category.image || '');
    } else {
      setEditingId(null);
      setFormData({ nameEn: '', nameAr: '' });
      setExistingImage('');
      setPreviewUrl('');
    }
    setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModalError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setModalError(t.fileSizeError);
      e.target.value = '';
      return;
    }

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);

    if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
      setModalError(t.fileSizeError);
      setSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('nameEn', formData.nameEn);
      data.append('nameAr', formData.nameAr);
      data.append('existingImage', existingImage);

      if (selectedFile) {
        data.append('image', selectedFile);
      }

      let res: { success: boolean; error?: string; message?: string };

      if (editingId) {
        res = await updateCategory(editingId, data);
      } else {
        res = await createCategory(data);
      }

      if (res.success) {
        closeModal();
        fetchData();
      } else {
        setModalError(res.error || t.saveError);
      }
    } catch (error: any) {
      console.error('Error saving category:', error);
      setModalError(t.serverError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.deleteConfirm)) return;

    setDeletingId(id);
    setPageError(null);

    try {
      const res = await deleteCategory(id);
      if (res.success) {
        fetchData();
      } else {
        setPageError(res.error || t.deleteError);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setPageError(t.deleteServerError);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1B3D]">{t.title}</h1>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-[#5C3D6A] text-white px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold hover:bg-[#4a3156] transition-colors shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" /> {t.addCategory}
          </button>
        </div>

        {/* Global Page Error Banner */}
        {pageError && (
          <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs font-medium">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
            <span className="flex-1">{pageError}</span>
            <button onClick={() => setPageError(null)} className="text-rose-400 hover:text-rose-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#80608E]" />
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-3xl border-2 border-[#D8CDE0] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-start">
                <thead>
                  <tr className="bg-[#FAF9F6] border-b border-[#E5DCEB] text-xs font-bold text-[#80608E] uppercase tracking-wider">
                    <th className="p-4 text-start">{t.colCategory}</th>
                    <th className="p-4 text-end">{t.colActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DCD0] text-xs font-semibold">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="p-8 text-center text-gray-400">
                        {t.noCategories}
                      </td>
                    </tr>
                  ) : (
                    categories.map((c) => (
                      <tr key={c._id} className="align-middle hover:bg-[#FAF9F6]/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {c.image ? (
                              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#EFE3D5] border border-[#E8DCD0] shrink-0">
                                <Image
                                  src={c.image}
                                  alt={c.name?.[lang] || c.name?.en || 'Category'}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#E8DCD0] flex items-center justify-center text-gray-400 shrink-0">
                                <ImageIcon className="w-4 h-4" />
                              </div>
                            )}
                            <span className="font-bold text-[#2A1B3D]">
                              {lang === 'ar'
                                ? `${c.name?.ar || ''} / ${c.name?.en || ''}`
                                : `${c.name?.en || ''} / ${c.name?.ar || ''}`}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-end space-x-2 rtl:space-x-reverse whitespace-nowrap">
                          <button
                            onClick={() => openModal(c)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title={t.edit}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(c._id)}
                            disabled={deletingId === c._id}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                            title={t.delete}
                          >
                            {deletingId === c._id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 border-2 border-[#D8CDE0] shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-xl font-bold text-[#2A1B3D]">
                {editingId ? t.editCategory : t.createCategory}
              </h2>
              <button onClick={closeModal} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            {/* Modal Error Banner */}
            {modalError && (
              <div className="mb-4 flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block mb-1 text-[#2A1B3D]">{t.nameEn}</label>
                <input
                  required
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full p-3 bg-[#FAF9F6] border border-[#E8DCD0] rounded-xl focus:outline-none focus:border-[#80608E]"
                  placeholder="e.g. Perfumes"
                />
              </div>

              <div>
                <label className="block mb-1 text-[#2A1B3D]">{t.nameAr}</label>
                <input
                  required
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  className="w-full p-3 bg-[#FAF9F6] border border-[#E8DCD0] rounded-xl focus:outline-none focus:border-[#80608E]"
                  placeholder="مثال: العطور"
                />
              </div>

              <div>
                <label className="block mb-1 text-[#2A1B3D]">{t.categoryImage}</label>
                <label className="flex items-center justify-center gap-2 w-full p-4 bg-[#FAF9F6] border-2 border-dashed border-[#E8DCD0] rounded-xl cursor-pointer hover:border-[#80608E] transition-colors text-gray-500">
                  <Upload className="w-4 h-4 text-[#80608E]" />
                  <span className="truncate max-w-[200px]">
                    {selectedFile ? selectedFile.name : t.chooseImage}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {previewUrl && (
                <div className="relative w-full h-36 rounded-xl overflow-hidden bg-[#EFE3D5] border border-[#E8DCD0]">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#5C3D6A] text-white rounded-xl hover:bg-[#4a3156] transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.saving}</span>
                  </>
                ) : (
                  <span>{t.save}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}