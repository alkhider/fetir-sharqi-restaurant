import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Utensils,
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  Image,
} from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { allItems, categories } from '@/data/menuItems';
import type { MenuItem } from '@/data/menuItems';
import { cn } from '@/lib/utils';

export default function MenuManagement() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const filteredItems = allItems.filter((item) => {
    const matchesSearch =
      search === '' ||
      item.name.includes(search) ||
      item.id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalItems = allItems.length;
  const categoryCount = filteredItems.length;

  return (
    <div className="min-h-[100dvh] bg-[#F5EFE6]" style={{ direction: 'rtl' }}>
      <AdminSidebar />

      {/* Top Bar */}
      <div className="mr-[280px] bg-white border-b border-[#E5D9C8] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Utensils className="w-6 h-6 text-[#D4A844]" />
            <div>
              <h1 className="font-bold text-xl text-[#2B2118]">
                إدارة القائمة
              </h1>
              <p className="text-xs text-[#8C7A66]">
                {totalItems} منتج · {categories.length} فئة
              </p>
            </div>
          </div>
          <button
            onClick={() => alert('إضافة منتج جديد قريباً')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4A844] text-white font-bold text-sm hover:bg-[#C49A3A] transition-all"
          >
            <Plus className="w-4 h-4" />
            إضافة منتج
          </button>
        </div>
      </div>

      <div className="mr-[280px] p-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl p-4 border border-[#E5D9C8]"
            >
              <p className="text-xs text-[#8C7A66]">{cat.label}</p>
              <p className="text-2xl font-bold text-[#2B2118] mt-1">
                {allItems.filter((item) => item.category === cat.key).length}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A66]" />
            <input
              type="text"
              placeholder="ابحث باسم المنتج أو ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pr-10 pl-4 rounded-lg bg-white border border-[#E5D9C8] text-sm text-[#2B2118] placeholder:text-[#8C7A66]/50 focus:outline-none focus:border-[#D4A844] focus:ring-1 focus:ring-[#D4A844]"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 px-4 rounded-lg bg-white border border-[#E5D9C8] text-sm text-[#2B2118] focus:outline-none focus:border-[#D4A844]"
          >
            <option value="all">جميع الفئات</option>
            {categories.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[#E5D9C8] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F5EFE6] border-b border-[#E5D9C8]">
                <tr>
                  <th className="text-right px-4 py-3 font-bold text-[#2B2118]">الصورة</th>
                  <th className="text-right px-4 py-3 font-bold text-[#2B2118]">ID</th>
                  <th className="text-right px-4 py-3 font-bold text-[#2B2118]">الاسم</th>
                  <th className="text-right px-4 py-3 font-bold text-[#2B2118]">الفئة</th>
                  <th className="text-right px-4 py-3 font-bold text-[#2B2118]">السعر</th>
                  <th className="text-right px-4 py-3 font-bold text-[#2B2118]">الوصف</th>
                  <th className="text-right px-4 py-3 font-bold text-[#2B2118]">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: (i % 20) * 0.01 }}
                    className="border-b border-[#F5EFE6] hover:bg-[#F5EFE6]/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded-lg bg-[#F5EFE6] overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/logo.png';
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[#8C7A66]">{item.id}</td>
                    <td className="px-4 py-3 font-bold text-[#2B2118]">{item.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-md bg-[#D4A844]/15 text-[#D4A844] text-xs font-bold">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-[#2B2118]">
                      {item.price}
                      {item.priceLarge ? ` / ${item.priceLarge}` : ''} ر.س
                    </td>
                    <td className="px-4 py-3 text-[#8C7A66] max-w-xs truncate">
                      {item.description || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-1.5 rounded-lg bg-[#F5EFE6] text-[#8C7A66] hover:bg-[#D4A844] hover:text-white transition-all"
                          title="تعديل"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`هل تريد حذف ${item.name}؟`)) {
                              alert('حذف المنتج قريباً عبر الـ API');
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16 text-[#8C7A66]">
              <Utensils className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-bold">لا توجد نتائج</p>
            </div>
          )}

          <div className="px-4 py-3 bg-[#F5EFE6] border-t border-[#E5D9C8] text-xs text-[#8C7A66]">
            عرض {categoryCount} من {totalItems} منتج
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditingItem(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-lg p-6"
          >
            <h3 className="font-bold text-lg text-[#2B2118] mb-4">تعديل: {editingItem.name}</h3>
            <div className="aspect-square max-h-48 bg-[#F5EFE6] rounded-xl overflow-hidden mb-4 mx-auto">
              <img src={editingItem.image} alt={editingItem.name} className="w-full h-full object-contain" />
            </div>
            <p className="text-sm text-[#8C7A66]">
              الصورة: <span className="font-mono text-xs bg-[#F5EFE6] px-1.5 py-0.5 rounded">{editingItem.image}</span>
            </p>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#F5EFE6] text-[#2B2118] font-bold text-sm hover:bg-[#E5D9C8] transition-all"
              >
                إغلاق
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
