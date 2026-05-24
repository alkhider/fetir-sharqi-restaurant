import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  RotateCcw,
  Download,
  Upload,
  Flame,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import { useMenuData } from '@/context/MenuDataContext';
import PasswordGate from '@/components/PasswordGate';
import AdminSidebar from '@/components/AdminSidebar';

export default function MenuManagement() {
  return (
    <PasswordGate>
      <MenuManagementContent />
    </PasswordGate>
  );
}

function MenuManagementContent() {
  const { categories, allItems, updateItem, resetToDefault, exportToCSV, importFromCSV } =
    useMenuData();

  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [importMsg, setImportMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return allItems;
    const q = search.trim();
    return allItems.filter(
      (item) =>
        item.name.includes(q) ||
        item.description.includes(q) ||
        item.category.includes(q)
    );
  }, [allItems, search]);

  const startEdit = (item: (typeof allItems)[0]) => {
    setEditingId(item.id);
    setEditForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      priceLarge: item.priceLarge ? String(item.priceLarge) : '',
      calories: String(item.calories),
      caloriesLarge: item.caloriesLarge ? String(item.caloriesLarge) : '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = (id: string) => {
    const price = parseFloat(editForm.price);
    if (isNaN(price) || price <= 0) return;
    updateItem(id, {
      name: editForm.name,
      description: editForm.description,
      price,
      priceLarge: editForm.priceLarge ? parseFloat(editForm.priceLarge) : undefined,
      calories: parseFloat(editForm.calories) || 0,
      caloriesLarge: editForm.caloriesLarge ? parseFloat(editForm.caloriesLarge) : undefined,
    });
    setEditingId(null);
    setEditForm({});
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = String(ev.target?.result || '');
      const result = importFromCSV(text);
      if (result.errors.length > 0) {
        setImportMsg({ type: 'error', text: `${result.imported} imported. Errors: ${result.errors.join('; ')}` });
      } else {
        setImportMsg({ type: 'success', text: `${result.imported} items imported successfully` });
      }
      setTimeout(() => setImportMsg(null), 5000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-[100dvh] bg-[#2B2118]" dir="rtl">
      <AdminSidebar activeItem="إدارة المنيو" />
      <div className="mr-[280px] min-h-[100dvh] p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-cairo font-bold text-3xl text-[#D4A844]">إدارة المنيو</h1>
            <p className="text-[#FDF6EC]/50 font-tajawal text-sm mt-1">
              {allItems.length} صنف عبر {categories.length} فئة
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-[#D4A844]/15 hover:bg-[#D4A844]/25 text-[#D4A844] px-4 py-2.5 rounded-xl font-cairo font-bold text-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              تصدير CSV
            </button>
            <label className="flex items-center gap-2 bg-[#27AE60]/15 hover:bg-[#27AE60]/25 text-[#27AE60] px-4 py-2.5 rounded-xl font-cairo font-bold text-sm transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              استيراد CSV
              <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
            </label>
            <button
              onClick={resetToDefault}
              className="flex items-center gap-2 bg-[#C0392B]/15 hover:bg-[#C0392B]/25 text-[#C0392B] px-4 py-2.5 rounded-xl font-cairo font-bold text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              إعادة تعيين
            </button>
          </div>
        </div>

        {/* Import message */}
        {importMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-3 rounded-xl text-sm font-tajawal font-bold ${
              importMsg.type === 'success'
                ? 'bg-[#27AE60]/15 text-[#27AE60]'
                : 'bg-[#C0392B]/15 text-[#C0392B]'
            }`}
          >
            {importMsg.text}
          </motion.div>
        )}

        {/* Search */}
        <div className="relative mb-6 max-w-[480px]">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C5E3C]" />
          <input
            type="text"
            placeholder="ابحث في المنيو..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pr-12 pl-4 rounded-xl bg-[#FDF6EC] text-[#2B2118] font-tajawal placeholder:text-[#8C5E3C]/50 focus:outline-none focus:ring-2 focus:ring-[#D4A844]/50 transition-shadow"
          />
        </div>

        {/* Table */}
        <div className="bg-[#FDF6EC]/5 rounded-2xl border border-[#D4A844]/15 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-[#D4A844]/10 border-b border-[#D4A844]/20">
                  <th className="px-4 py-3 text-[#D4A844] font-cairo font-bold text-sm">الصنف</th>
                  <th className="px-4 py-3 text-[#D4A844] font-cairo font-bold text-sm">الفئة</th>
                  <th className="px-4 py-3 text-[#D4A844] font-cairo font-bold text-sm text-center">سعر وسط</th>
                  <th className="px-4 py-3 text-[#D4A844] font-cairo font-bold text-sm text-center">سعر كبير</th>
                  <th className="px-4 py-3 text-[#D4A844] font-cairo font-bold text-sm text-center">سعرة وسط</th>
                  <th className="px-4 py-3 text-[#D4A844] font-cairo font-bold text-sm text-center">سعرة كبير</th>
                  <th className="px-4 py-3 text-[#D4A844] font-cairo font-bold text-sm text-center">أكشن</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const isEditing = editingId === item.id;
                  const cat = categories.find((c) => c.key === item.category);
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-[#D4A844]/10 hover:bg-[#D4A844]/5 transition-colors"
                    >
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <div className="space-y-1">
                            <input
                              value={editForm.name || ''}
                              onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                              className="w-full h-8 px-2 rounded bg-[#FDF6EC] text-[#2B2118] font-cairo text-sm"
                            />
                            <input
                              value={editForm.description || ''}
                              onChange={(e) =>
                                setEditForm((p) => ({ ...p, description: e.target.value }))
                              }
                              className="w-full h-7 px-2 rounded bg-[#FDF6EC] text-[#8C5E3C] font-tajawal text-xs"
                              placeholder="وصف..."
                            />
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-2">
                              {item.isHot && <Flame className="w-4 h-4 text-[#D4652A] shrink-0" />}
                              <span className="font-cairo font-bold text-[#FDF6EC] text-sm">
                                {item.name}
                              </span>
                            </div>
                            <span className="text-[#8C5E3C] text-xs font-tajawal line-clamp-1">
                              {item.description}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[#D4A844] text-sm font-cairo">{cat?.label || item.category}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isEditing ? (
                          <input
                            value={editForm.price || ''}
                            onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))}
                            className="w-16 h-8 px-2 rounded bg-[#FDF6EC] text-[#2B2118] font-bold text-sm text-center"
                            type="number"
                            min="0"
                            step="0.5"
                          />
                        ) : (
                          <span className="text-[#FDF6EC] font-bold text-sm">{item.price}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isEditing ? (
                          <input
                            value={editForm.priceLarge || ''}
                            onChange={(e) =>
                              setEditForm((p) => ({ ...p, priceLarge: e.target.value }))
                            }
                            className="w-16 h-8 px-2 rounded bg-[#FDF6EC] text-[#2B2118] font-bold text-sm text-center"
                            type="number"
                            min="0"
                            step="0.5"
                          />
                        ) : (
                          <span className="text-[#FDF6EC] font-bold text-sm">
                            {item.priceLarge ?? '—'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isEditing ? (
                          <input
                            value={editForm.calories || ''}
                            onChange={(e) =>
                              setEditForm((p) => ({ ...p, calories: e.target.value }))
                            }
                            className="w-16 h-8 px-2 rounded bg-[#FDF6EC] text-[#2B2118] font-bold text-sm text-center"
                            type="number"
                            min="0"
                          />
                        ) : (
                          <span className="text-[#8C5E3C] text-sm font-tajawal">
                            {item.calories}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isEditing ? (
                          <input
                            value={editForm.caloriesLarge || ''}
                            onChange={(e) =>
                              setEditForm((p) => ({ ...p, caloriesLarge: e.target.value }))
                            }
                            className="w-16 h-8 px-2 rounded bg-[#FDF6EC] text-[#2B2118] font-bold text-sm text-center"
                            type="number"
                            min="0"
                          />
                        ) : (
                          <span className="text-[#8C5E3C] text-sm font-tajawal">
                            {item.caloriesLarge ?? '—'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => saveEdit(item.id)}
                              className="w-8 h-8 rounded-lg bg-[#27AE60]/20 text-[#27AE60] hover:bg-[#27AE60]/30 flex items-center justify-center transition-colors"
                              title="حفظ"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="w-8 h-8 rounded-lg bg-[#C0392B]/20 text-[#C0392B] hover:bg-[#C0392B]/30 flex items-center justify-center transition-colors"
                              title="إلغاء"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(item)}
                            className="w-8 h-8 rounded-lg bg-[#D4A844]/15 text-[#D4A844] hover:bg-[#D4A844]/25 flex items-center justify-center transition-colors"
                            title="تعديل"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-[#8C5E3C] font-tajawal">
              لا توجد نتائج للبحث
            </div>
          )}

          {/* Footer stats */}
          <div className="border-t border-[#D4A844]/15 px-4 py-3 flex items-center justify-between text-[#8C5E3C] text-sm font-tajawal">
            <span>
              عرض {filtered.length} من {allItems.length} صنف
            </span>
            <span>{categories.length} فئة</span>
          </div>
        </div>
      </div>
    </div>
  );
}
