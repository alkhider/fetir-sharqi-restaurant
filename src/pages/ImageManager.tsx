import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image,
  Upload,
  Search,
  RotateCcw,
  Check,
  AlertCircle,
  X,
  Download,
} from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { cn } from '@/lib/utils';
import { allItems as menuItems, categories } from '@/data/menuItems';
import type { MenuItem } from '@/data/menuItems';

/* ─── Types ─── */
interface ImageOverride {
  itemId: string;
  dataUrl: string;
  fileName: string;
  timestamp: number;
}

/* ─── Helpers ─── */
const STORAGE_KEY = 'fetir_image_overrides';

function getOverrides(): Record<string, ImageOverride> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveOverrides(overrides: Record<string, ImageOverride>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

function clearOverride(itemId: string) {
  const overrides = getOverrides();
  delete overrides[itemId];
  saveOverrides(overrides);
}

function setOverride(itemId: string, dataUrl: string, fileName: string) {
  const overrides = getOverrides();
  overrides[itemId] = { itemId, dataUrl, fileName, timestamp: Date.now() };
  saveOverrides(overrides);
}

/* ─── Item Card ─── */
function ItemImageCard({
  item,
  index,
  onReplace,
}: {
  item: MenuItem;
  index: number;
  onReplace: (id: string) => void;
}) {
  const overrides = getOverrides();
  const override = overrides[item.id];
  const displayImage = override?.dataUrl || item.image;
  const isOverridden = !!override;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: (index % 12) * 0.02 }}
      className={cn(
        'relative rounded-xl overflow-hidden border-2 transition-all',
        isOverridden
          ? 'border-green-500 shadow-green-200 shadow-md'
          : 'border-[#E5D9C8] hover:border-[#D4A844]'
      )}
    >
      {/* Status Badge */}
      {isOverridden && (
        <div className="absolute top-2 right-2 z-10 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <Check className="w-3 h-3" />
          تم الاستبدال
        </div>
      )}

      {/* Image */}
      <div className="aspect-square bg-[#F5EFE6] relative overflow-hidden">
        <img
          src={displayImage}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/logo.png';
          }}
        />
      </div>

      {/* Info */}
      <div className="p-3 bg-white">
        <h4 className="font-bold text-sm text-[#2B2118] truncate">
          {item.name}
        </h4>
        <p className="text-xs text-[#8C7A66] mt-0.5 truncate">
          {item.id} · {item.image}
        </p>
        {isOverridden && (
          <p className="text-xs text-green-600 mt-0.5 truncate">
            → {override.fileName}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onReplace(item.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold transition-all',
              isOverridden
                ? 'bg-[#D4A844] text-white hover:bg-[#C49A3A]'
                : 'bg-[#F5EFE6] text-[#2B2118] hover:bg-[#E5D9C8]'
            )}
          >
            <Upload className="w-3 h-3" />
            {isOverridden ? 'تغيير' : 'استبدل'}
          </button>
          {isOverridden && (
            <button
              onClick={() => {
                clearOverride(item.id);
                window.location.reload();
              }}
              className="px-2 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all"
              title="إلغاء الاستبدال"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Upload Modal ─── */
function UploadModal({
  item,
  onClose,
  onUpload,
}: {
  item: MenuItem;
  onClose: () => void;
  onUpload: (id: string, dataUrl: string, fileName: string) => void;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        alert('الرجاء اختيار ملف صورة فقط');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت');
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleConfirm = () => {
    if (preview && fileName) {
      onUpload(item.id, preview, fileName);
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
        style={{ direction: 'rtl' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E5D9C8]">
          <h3 className="font-bold text-lg text-[#2B2118]">
            استبدال صورة: {item.name}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F5EFE6] flex items-center justify-center hover:bg-[#E5D9C8] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Current Image */}
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-lg bg-[#F5EFE6] overflow-hidden shrink-0">
              <img
                src={item.image}
                alt="current"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#8C7A66]">
                الصورة الحالية:{' '}
                <span className="font-mono text-xs bg-[#F5EFE6] px-1.5 py-0.5 rounded">
                  {item.image}
                </span>
              </p>
              <p className="text-sm text-[#8C7A66] mt-1">ID: {item.id}</p>
            </div>
          </div>

          {/* Drop Zone */}
          {!preview ? (
            <div
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
                dragActive
                  ? 'border-[#D4A844] bg-[#D4A844]/5'
                  : 'border-[#E5D9C8] hover:border-[#D4A844] hover:bg-[#F5EFE6]'
              )}
            >
              <Upload className="w-10 h-10 text-[#D4A844] mx-auto mb-2" />
              <p className="font-bold text-[#2B2118] text-sm">
                اسحب الصورة هنا أو انقر للاختيار
              </p>
              <p className="text-xs text-[#8C7A66] mt-1">
                PNG, JPG, WEBP · الحد الأقصى 5MB
              </p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-bold text-[#2B2118]">معاينة الصورة الجديدة:</p>
              <div className="aspect-square max-h-64 bg-[#F5EFE6] rounded-xl overflow-hidden">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs text-[#8C7A66]">
                الملف: {fileName}
              </p>
              <button
                onClick={() => {
                  setPreview(null);
                  setFileName('');
                }}
                className="text-xs text-red-500 hover:underline"
              >
                إلغاء واختيار ملف آخر
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-[#E5D9C8]">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-[#F5EFE6] text-[#2B2118] font-bold text-sm hover:bg-[#E5D9C8] transition-all"
          >
            إلغاء
          </button>
          <button
            onClick={handleConfirm}
            disabled={!preview}
            className={cn(
              'flex-1 py-2.5 rounded-xl font-bold text-sm transition-all',
              preview
                ? 'bg-[#D4A844] text-white hover:bg-[#C49A3A]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            )}
          >
            تأكيد الاستبدال
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function ImageManager() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [replaceItemId, setReplaceItemId] = useState<string | null>(null);
  const [overridesCount, setOverridesCount] = useState(() => Object.keys(getOverrides()).length);

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      search === '' ||
      item.name.includes(search) ||
      item.id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUpload = (id: string, dataUrl: string, fileName: string) => {
    setOverride(id, dataUrl, fileName);
    setOverridesCount(Object.keys(getOverrides()).length);
  };

  const handleExport = () => {
    const overrides = getOverrides();
    const data = JSON.stringify(overrides, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'image-overrides.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAll = () => {
    if (confirm('هل أنت متأكد من إلغاء جميع الاستبدالات؟')) {
      localStorage.removeItem(STORAGE_KEY);
      setOverridesCount(0);
      window.location.reload();
    }
  };

  const replaceItem = filteredItems.find((i) => i.id === replaceItemId);

  return (
    <div className="min-h-[100dvh] bg-[#F5EFE6]" style={{ direction: 'rtl' }}>
      <AdminSidebar />

      {/* Top Bar */}
      <div className="mr-[280px] bg-white border-b border-[#E5D9C8] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image className="w-6 h-6 text-[#D4A844]" />
            <div>
              <h1 className="font-bold text-xl text-[#2B2118]">
                إدارة الصور
              </h1>
              <p className="text-xs text-[#8C7A66]">
                {menuItems.length} منتج · {overridesCount} استبدال
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {overridesCount > 0 && (
              <>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2B2118] text-white font-bold text-sm hover:bg-[#3D2E1F] transition-all"
                >
                  <Download className="w-4 h-4" />
                  تصدير الاستبدالات
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-500 font-bold text-sm hover:bg-red-100 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  إلغاء الكل
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mr-[280px] p-6">
        {/* Info Banner */}
        <div className="bg-[#D4A844]/10 border border-[#D4A844]/30 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#D4A844] shrink-0 mt-0.5" />
          <div className="text-sm text-[#2B2118]">
            <p className="font-bold">كيفية الاستخدام:</p>
            <p className="text-[#8C7A66] mt-1">
              1. اختر المنتج · 2. ارفع الصورة الجديدة · 3. تأكد من المعاينة · 4. انقر "تأكيد الاستبدال" · 5. اضغط "تصدير الاستبدالات" لتحميل الصور الجديدة ورفعها للسيرفر
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
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

          {/* Category Filter */}
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

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredItems.map((item: typeof menuItems[number], i: number) => (
            <ItemImageCard
              key={item.id}
              item={item}
              index={i}
              onReplace={setReplaceItemId}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-[#8C7A66]">
            <Image className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-bold">لا توجد نتائج</p>
            <p className="text-sm mt-1">جرب بحث آخر أو فئة مختلفة</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {replaceItem && (
          <UploadModal
            item={replaceItem}
            onClose={() => setReplaceItemId(null)}
            onUpload={handleUpload}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
