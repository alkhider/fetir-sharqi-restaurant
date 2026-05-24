import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, RotateCcw, Download, Pencil, Check, X, Plus, Trash2 } from 'lucide-react';
import { useOffers, getFormattedHours } from '@/context/OffersContext';
import type { Offer } from '@/context/OffersContext';
import PasswordGate from '@/components/PasswordGate';
import AdminSidebar from '@/components/AdminSidebar';



export default function OffersManagement() {
  return (
    <PasswordGate>
      <OffersManagementContent />
    </PasswordGate>
  );
}

function OffersManagementContent() {
  const { offers, workingDays, updateOffer, addOffer, removeOffer, updateWorkingDay, resetToDefault, exportToCSV } = useOffers();

  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Offer>>({});
  const [activeTab, setActiveTab] = useState<'offers' | 'hours'>('offers');
  const [showAdd, setShowAdd] = useState(false);
  const [newOffer, setNewOffer] = useState<Partial<Offer>>({
    id: '', title: '', description: '', terms: '', badge: '', icon: 'percent',
    image: '/food-mushaltat.png', bgGradient: 'from-[#D4A844] to-[#B8942E]', expiryDays: 7, active: true,
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return offers;
    return offers.filter((o) => o.title.includes(search) || o.description.includes(search));
  }, [offers, search]);

  const formattedHours = useMemo(() => getFormattedHours(workingDays), [workingDays]);

  const startEdit = (o: Offer) => { setEditingId(o.id); setEditForm({ ...o }); };
  const cancelEdit = () => { setEditingId(null); setEditForm({}); };
  const saveEdit = (id: string) => { updateOffer(id, editForm); setEditingId(null); setEditForm({}); };

  const handleAdd = () => {
    if (!newOffer.id || !newOffer.title) return;
    addOffer(newOffer as Offer);
    setShowAdd(false);
    setNewOffer({ id: '', title: '', description: '', terms: '', badge: '', icon: 'percent', image: '/food-mushaltat.png', bgGradient: 'from-[#D4A844] to-[#B8942E]', expiryDays: 7, active: true });
  };

  return (
    <div className="min-h-[100dvh] bg-[#2B2118]" dir="rtl">
      <AdminSidebar activeItem="إدارة العروض" />
      <div className="mr-[280px] min-h-[100dvh] p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-cairo font-bold text-3xl text-[#D4A844]">إدارة العروض</h1>
            <p className="text-[#FDF6EC]/50 font-tajawal text-sm mt-1">{offers.filter((o) => o.active).length} عرض نشط من {offers.length}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportToCSV} className="flex items-center gap-2 bg-[#D4A844]/15 hover:bg-[#D4A844]/25 text-[#D4A844] px-4 py-2.5 rounded-xl font-cairo font-bold text-sm transition-colors">
              <Download className="w-4 h-4" /> تصدير CSV
            </button>
            <button onClick={resetToDefault} className="flex items-center gap-2 bg-[#C0392B]/15 hover:bg-[#C0392B]/25 text-[#C0392B] px-4 py-2.5 rounded-xl font-cairo font-bold text-sm transition-colors">
              <RotateCcw className="w-4 h-4" /> إعادة تعيين
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#D4A844]/15 pb-2">
          {[
            { key: 'offers' as const, label: 'العروض', count: offers.length },
            { key: 'hours' as const, label: 'ساعات العمل', count: formattedHours.length },
          ].map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-5 py-2 rounded-t-lg font-cairo font-bold text-sm transition-colors ${activeTab === t.key ? 'bg-[#D4A844]/20 text-[#D4A844] border-b-2 border-[#D4A844]' : 'text-[#FDF6EC]/50 hover:text-[#FDF6EC]'}`}>
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {/* ─── OFFERS TAB ─── */}
        {activeTab === 'offers' && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1 max-w-[400px]">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C5E3C]" />
                <input type="text" placeholder="ابحث في العروض..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pr-12 pl-4 rounded-xl bg-[#FDF6EC] text-[#2B2118] font-tajawal placeholder:text-[#8C5E3C]/50 focus:outline-none focus:ring-2 focus:ring-[#D4A844]/50 text-sm" />
              </div>
              <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-[#27AE60]/20 hover:bg-[#27AE60]/30 text-[#27AE60] px-4 py-2 rounded-xl font-cairo font-bold text-sm transition-colors">
                <Plus className="w-4 h-4" /> عرض جديد
              </button>
            </div>

            {/* Add Offer Form */}
            {showAdd && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-[#FDF6EC]/5 rounded-xl border border-[#27AE60]/30 p-4 mb-4">
                <h3 className="font-cairo font-bold text-[#27AE60] mb-3 text-sm">عرض جديد</h3>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <input placeholder="معرف (ID)" value={newOffer.id} onChange={(e) => setNewOffer((p) => ({ ...p, id: e.target.value }))}
                    className="h-9 px-3 rounded-lg bg-[#FDF6EC] text-[#2B2118] font-cairo text-sm" />
                  <input placeholder="عنوان العرض" value={newOffer.title} onChange={(e) => setNewOffer((p) => ({ ...p, title: e.target.value }))}
                    className="h-9 px-3 rounded-lg bg-[#FDF6EC] text-[#2B2118] font-cairo text-sm" />
                  <input placeholder="شارة (مثال: خصم 20%)" value={newOffer.badge} onChange={(e) => setNewOffer((p) => ({ ...p, badge: e.target.value }))}
                    className="h-9 px-3 rounded-lg bg-[#FDF6EC] text-[#2B2118] font-cairo text-sm" />
                  <input placeholder="وصف" value={newOffer.description} onChange={(e) => setNewOffer((p) => ({ ...p, description: e.target.value }))}
                    className="h-9 px-3 rounded-lg bg-[#FDF6EC] text-[#2B2118] font-cairo text-sm col-span-2" />
                  <input placeholder="شروط" value={newOffer.terms} onChange={(e) => setNewOffer((p) => ({ ...p, terms: e.target.value }))}
                    className="h-9 px-3 rounded-lg bg-[#FDF6EC] text-[#2B2118] font-cairo text-sm" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAdd} className="bg-[#27AE60] hover:bg-[#27AE60]/80 text-white px-4 py-2 rounded-lg font-cairo font-bold text-sm transition-colors">إضافة</button>
                  <button onClick={() => setShowAdd(false)} className="bg-[#C0392B]/20 hover:bg-[#C0392B]/30 text-[#C0392B] px-4 py-2 rounded-lg font-cairo font-bold text-sm transition-colors">إلغاء</button>
                </div>
              </motion.div>
            )}

            {/* Offers Table */}
            <div className="bg-[#FDF6EC]/5 rounded-2xl border border-[#D4A844]/15 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead><tr className="bg-[#D4A844]/10 border-b border-[#D4A844]/20">
                    <th className="px-4 py-3 text-[#D4A844] font-cairo font-bold text-sm">العرض</th>
                    <th className="px-4 py-3 text-[#D4A844] font-cairo font-bold text-sm">الشارة</th>
                    <th className="px-4 py-3 text-[#D4A844] font-cairo font-bold text-sm text-center">أيام الانتهاء</th>
                    <th className="px-4 py-3 text-[#D4A844] font-cairo font-bold text-sm text-center">نشط</th>
                    <th className="px-4 py-3 text-[#D4A844] font-cairo font-bold text-sm text-center">أكشن</th>
                  </tr></thead>
                  <tbody>
                    {filtered.map((o) => {
                      const isEditing = editingId === o.id;
                      return (
                        <tr key={o.id} className="border-b border-[#D4A844]/10 hover:bg-[#D4A844]/5 transition-colors">
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <div className="space-y-1">
                                <input value={editForm.title || ''} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                                  className="w-full h-8 px-2 rounded bg-[#FDF6EC] text-[#2B2118] font-cairo text-sm" />
                                <input value={editForm.description || ''} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                                  className="w-full h-7 px-2 rounded bg-[#FDF6EC] text-[#8C5E3C] font-tajawal text-xs" placeholder="وصف..." />
                                <input value={editForm.terms || ''} onChange={(e) => setEditForm((p) => ({ ...p, terms: e.target.value }))}
                                  className="w-full h-7 px-2 rounded bg-[#FDF6EC] text-[#8C5E3C] font-tajawal text-xs" placeholder="شروط..." />
                              </div>
                            ) : (
                              <div>
                                <span className={`font-cairo font-bold text-sm ${o.active ? 'text-[#FDF6EC]' : 'text-[#FDF6EC]/40 line-through'}`}>{o.title}</span>
                                <p className="text-[#8C5E3C] text-xs font-tajawal line-clamp-1">{o.description}</p>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <input value={editForm.badge || ''} onChange={(e) => setEditForm((p) => ({ ...p, badge: e.target.value }))}
                                className="w-24 h-8 px-2 rounded bg-[#FDF6EC] text-[#2B2118] font-cairo text-xs text-center" />
                            ) : (
                              <span className="bg-[#D4A844]/15 text-[#D4A844] px-2 py-1 rounded-full text-xs font-bold">{o.badge}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {isEditing ? (
                              <input type="number" min={1} value={editForm.expiryDays || 0} onChange={(e) => setEditForm((p) => ({ ...p, expiryDays: parseInt(e.target.value) || 1 }))}
                                className="w-16 h-8 px-2 rounded bg-[#FDF6EC] text-[#2B2118] font-bold text-sm text-center" />
                            ) : (
                              <span className="text-[#FDF6EC] text-sm font-cairo">{o.expiryDays} يوم</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => updateOffer(o.id, { active: !o.active })}
                              className={`w-10 h-6 rounded-full transition-colors relative ${o.active ? 'bg-[#27AE60]' : 'bg-[#C0392B]/30'}`}>
                              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${o.active ? 'left-5' : 'left-1'}`} />
                            </button>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {isEditing ? (
                              <div className="flex gap-1 justify-center">
                                <button onClick={() => saveEdit(o.id)} className="w-8 h-8 rounded-lg bg-[#27AE60]/20 text-[#27AE60] flex items-center justify-center"><Check className="w-4 h-4" /></button>
                                <button onClick={cancelEdit} className="w-8 h-8 rounded-lg bg-[#C0392B]/20 text-[#C0392B] flex items-center justify-center"><X className="w-4 h-4" /></button>
                              </div>
                            ) : (
                              <div className="flex gap-1 justify-center">
                                <button onClick={() => startEdit(o)} className="w-8 h-8 rounded-lg bg-[#D4A844]/15 text-[#D4A844] flex items-center justify-center"><Pencil className="w-4 h-4" /></button>
                                <button onClick={() => removeOffer(o.id)} className="w-8 h-8 rounded-lg bg-[#C0392B]/15 text-[#C0392B] flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && <div className="text-center py-10 text-[#8C5E3C] font-tajawal">لا توجد نتائج</div>}
            </div>
          </>
        )}

        {/* ─── WORKING HOURS TAB ─── */}
        {activeTab === 'hours' && (
          <div className="bg-[#FDF6EC]/5 rounded-2xl border border-[#D4A844]/15 p-6">
            <h2 className="font-cairo font-bold text-xl text-[#D4A844] mb-6">ساعات العمل</h2>
            <div className="space-y-3 max-w-[600px]">
              {workingDays.map((d) => (
                <div key={d.dayEn} className="flex items-center gap-4 p-3 rounded-xl bg-[#2B2118]/50 border border-[#D4A844]/10">
                  <span className="w-20 font-cairo font-bold text-[#FDF6EC] text-sm">{d.day}</span>

                  <button onClick={() => updateWorkingDay(d.dayEn, { isClosed: !d.isClosed })}
                    className={`w-14 h-7 rounded-full transition-colors relative shrink-0 ${d.isClosed ? 'bg-[#C0392B]/30' : 'bg-[#27AE60]'}`}>
                    <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${d.isClosed ? 'left-1' : 'left-7'}`} />
                  </button>
                  <span className={`text-xs font-tajawal w-12 ${d.isClosed ? 'text-[#C0392B]' : 'text-[#27AE60]'}`}>{d.isClosed ? 'مغلق' : 'مفتوح'}</span>

                  {!d.isClosed && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-[#8C5E3C] text-xs font-tajawal">من</span>
                        <input type="time" value={d.open} onChange={(e) => updateWorkingDay(d.dayEn, { open: e.target.value })}
                          className="h-8 px-2 rounded bg-[#FDF6EC] text-[#2B2118] font-mono text-sm text-center" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#8C5E3C] text-xs font-tajawal">إلى</span>
                        <input type="time" value={d.close} onChange={(e) => updateWorkingDay(d.dayEn, { close: e.target.value })}
                          className="h-8 px-2 rounded bg-[#FDF6EC] text-[#2B2118] font-mono text-sm text-center" />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 rounded-xl bg-[#D4A844]/10 border border-[#D4A844]/20">
              <h3 className="font-cairo font-bold text-sm text-[#D4A844] mb-2">العرض على الموقع</h3>
              {formattedHours.map((h, i) => (
                <div key={i} className="flex justify-between py-1">
                  <span className="text-[#FDF6EC]/70 text-sm font-tajawal">{h.label}</span>
                  <span className="text-[#D4A844] font-semibold text-sm font-mono">{h.hours}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
