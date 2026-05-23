import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Download,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  LineChart,
  Receipt,
  Plus,
  ChevronDown,
  Search,
  FileSearch,
  Database,
  AlertCircle,
  Trash2,
  Eye,
} from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { cn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────
interface ExtractedInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  time: string;
  orderType: string;
  paymentType: string;
  customer: string;
  amount: number;
  status: 'valid' | 'warning' | 'error';
}

interface AdEntry {
  id: string;
  date: string;
  platform: string;
  campaignName: string;
  amount: number;
  reach: number;
  results: number;
}

interface ProcessingStep {
  label: string;
  description: string;
  status: 'pending' | 'active' | 'complete';
  icon: React.ElementType;
}

// ─── Mock Data ───────────────────────────────────────────────────
const mockInvoices: ExtractedInvoice[] = [
  { id: '1', invoiceNumber: 'INV-0015', date: '2024-06-15', time: '20:30', orderType: 'سفري', paymentType: 'نقدي', customer: 'زبون-05555', amount: 70, status: 'valid' },
  { id: '2', invoiceNumber: 'INV-0016', date: '2024-06-15', time: '20:35', orderType: 'هنجر ستيشن', paymentType: 'شبكة', customer: 'HungerStation', amount: 28, status: 'valid' },
  { id: '3', invoiceNumber: 'INV-0017', date: '2024-06-15', time: '20:45', orderType: 'كيتا', paymentType: 'نقدي', customer: 'Kita', amount: 40, status: 'valid' },
  { id: '4', invoiceNumber: 'INV-0018', date: '2024-06-15', time: '21:00', orderType: 'محلي', paymentType: 'مدى', customer: 'زبون-05556', amount: 55, status: 'valid' },
  { id: '5', invoiceNumber: 'INV-0019', date: '2024-06-15', time: '21:15', orderType: 'سفري', paymentType: 'نقدي', customer: 'زبون-05557', amount: 120, status: 'warning' },
  { id: '6', invoiceNumber: 'INV-0020', date: '2024-06-15', time: '21:30', orderType: 'هنجر ستيشن', paymentType: 'فيزا', customer: 'HungerStation', amount: 85, status: 'valid' },
  { id: '7', invoiceNumber: 'INV-0021', date: '2024-06-15', time: '21:45', orderType: 'كيتا', paymentType: 'شبكة', customer: 'Kita', amount: 200, status: 'valid' },
  { id: '8', invoiceNumber: 'INV-0022', date: '2024-06-15', time: '22:00', orderType: 'سفري', paymentType: 'نقدي', customer: 'زبون-05558', amount: 35, status: 'valid' },
  { id: '9', invoiceNumber: 'INV-0023', date: '2024-06-15', time: '22:15', orderType: 'محلي', paymentType: 'مدى', customer: 'زبون-05559', amount: 0, status: 'error' },
  { id: '10', invoiceNumber: 'INV-0024', date: '2024-06-15', time: '22:30', orderType: 'هنجر ستيشن', paymentType: 'فيزا', customer: 'HungerStation', amount: 150, status: 'valid' },
];

const mockAdEntries: AdEntry[] = [
  { id: '1', date: '2024-06-15', platform: 'Instagram', campaignName: 'حملة عيد الفطر', amount: 500, reach: 15000, results: 320 },
  { id: '2', date: '2024-06-14', platform: 'Snapchat', campaignName: 'عرض المشلتت', amount: 350, reach: 12000, results: 210 },
  { id: '3', date: '2024-06-13', platform: 'TikTok', campaignName: 'تسويق يومي', amount: 200, reach: 25000, results: 480 },
];

const reportCards = [
  { icon: BarChart3, title: 'تقرير المبيعات الشامل', description: 'تحليل المبيعات حسب الصنف والوقت وقناة البيع', color: '#D4A844', href: '/data/reports/sales' },
  { icon: TrendingUp, title: 'تحليل الإعلانات', description: 'تحليل العلاقة بين الإنفاق الإعلاني والمبيعات', color: '#D4652A', href: '/data/reports/advertising' },
  { icon: Users, title: 'تحليل العملاء', description: 'توزيع العملاء حسب النوع وتكرار الطلبات', color: '#5B8FA8', href: '/data/reports/customers' },
  { icon: Clock, title: 'الأنماط الزمنية', description: 'توزيع المبيعات حسب الساعة واليوم', color: '#6B7F59', href: '/data/reports/temporal' },
  { icon: LineChart, title: 'التنبؤات والتوقعات', description: 'توقعات المبيعات للأسبوع والشهر القادمين', color: '#2B2118', href: '/data/reports/forecasting' },
  { icon: Receipt, title: 'تكلفة الإعلانات', description: 'تفاصيل الإنفاق الإعلاني اليومي', color: '#E87B35', href: '/data/reports/ad-cost' },
];

const platforms = ['Facebook', 'Instagram', 'TikTok', 'Snapchat'];

// ─── Pipeline Step Component ─────────────────────────────────────
function PipelineStep({ step, index, isLast }: { step: ProcessingStep; index: number; isLast: boolean }) {
  return (
    <div className="flex items-center flex-1">
      <div className="flex flex-col items-center flex-1">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center border-2 relative',
            step.status === 'complete' && 'bg-[#27AE60]/15 border-[#27AE60]',
            step.status === 'active' && 'bg-[#D4A844]/15 border-[#D4A844]',
            step.status === 'pending' && 'bg-[#8C5E3C]/5 border-[#8C5E3C]/20'
          )}
        >
          {step.status === 'complete' ? (
            <CheckCircle2 className="w-6 h-6 text-[#27AE60]" />
          ) : step.status === 'active' ? (
            <>
              <step.icon className="w-6 h-6 text-[#D4A844]" />
              <span className="absolute inset-0 rounded-full border-2 border-[#D4A844] animate-ping opacity-30" />
            </>
          ) : (
            <step.icon className="w-6 h-6 text-[#8C5E3C]/30" />
          )}
        </motion.div>
        <div className="mt-3 text-center">
          <p className={cn(
            'font-cairo font-bold text-sm',
            step.status === 'complete' && 'text-[#27AE60]',
            step.status === 'active' && 'text-[#D4A844]',
            step.status === 'pending' && 'text-[#8C5E3C]/50'
          )}>
            {step.label}
          </p>
          <p className="font-tajawal text-[11px] text-[#8C5E3C] mt-0.5 max-w-[120px]">
            {step.description}
          </p>
        </div>
      </div>
      {!isLast && (
        <div className="flex-1 h-0.5 bg-[#8C5E3C]/10 mx-2 relative overflow-hidden">
          {step.status === 'complete' && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 1, delay: index * 0.3 }}
              className="absolute inset-0 bg-[#D4A844]/40"
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Preview Table Row ───────────────────────────────────────────
function StatusDot({ status }: { status: 'valid' | 'warning' | 'error' }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold',
      status === 'valid' && 'bg-[#27AE60]/10 text-[#27AE60]',
      status === 'warning' && 'bg-[#F39C12]/10 text-[#F39C12]',
      status === 'error' && 'bg-[#C0392B]/10 text-[#C0392B]'
    )}>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full',
        status === 'valid' && 'bg-[#27AE60]',
        status === 'warning' && 'bg-[#F39C12]',
        status === 'error' && 'bg-[#C0392B]'
      )} />
      {status === 'valid' && 'صحيح'}
      {status === 'warning' && 'تحذير'}
      {status === 'error' && 'خطأ'}
    </span>
  );
}

// ─── Main Data Processor Page ────────────────────────────────────
export default function DataProcessor() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [previewData, setPreviewData] = useState<ExtractedInvoice[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'preview' | 'ads' | 'reports'>('upload');
  const [searchQuery, setSearchQuery] = useState('');
  const [adEntries, setAdEntries] = useState<AdEntry[]>(mockAdEntries);

  // Ad entry form state
  const [adDate, setAdDate] = useState('');
  const [adPlatform, setAdPlatform] = useState('');
  const [adCampaign, setAdCampaign] = useState('');
  const [adAmount, setAdAmount] = useState('');
  const [adReach, setAdReach] = useState('');
  const [adResults, setAdResults] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps: ProcessingStep[] = [
    { label: 'الرفع', description: file ? file.name : 'في الانتظار', status: processingStep >= 1 ? 'complete' : 'pending', icon: UploadCloud },
    { label: 'الاستخراج', description: 'استخراج البيانات', status: processingStep === 2 ? 'active' : processingStep > 2 ? 'complete' : 'pending', icon: FileSearch },
    { label: 'التحقق', description: 'التحقق والتنظيف', status: processingStep === 3 ? 'active' : processingStep > 3 ? 'complete' : 'pending', icon: CheckCircle2 },
    { label: 'قاعدة البيانات', description: 'حفظ البيانات', status: processingStep === 4 ? 'active' : processingStep > 4 ? 'complete' : 'pending', icon: Database },
  ];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      startProcessing();
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      startProcessing();
    }
  }, []);

  const startProcessing = () => {
    setIsProcessing(true);
    setProcessingStep(1);
    setIsProcessed(false);
    setPreviewData([]);

    setTimeout(() => setProcessingStep(2), 800);
    setTimeout(() => setProcessingStep(3), 2000);
    setTimeout(() => setProcessingStep(4), 3200);
    setTimeout(() => {
      setProcessingStep(5);
      setIsProcessed(true);
      setPreviewData(mockInvoices);
      setIsProcessing(false);
    }, 4500);
  };

  const handleProcessAgain = () => {
    if (file) startProcessing();
  };

  const handleAddAdEntry = () => {
    if (!adDate || !adPlatform || !adCampaign || !adAmount) return;
    const newEntry: AdEntry = {
      id: Date.now().toString(),
      date: adDate,
      platform: adPlatform,
      campaignName: adCampaign,
      amount: Number(adAmount),
      reach: Number(adReach) || 0,
      results: Number(adResults) || 0,
    };
    setAdEntries([newEntry, ...adEntries]);
    setAdDate('');
    setAdPlatform('');
    setAdCampaign('');
    setAdAmount('');
    setAdReach('');
    setAdResults('');
  };

  const handleDeleteAdEntry = (id: string) => {
    setAdEntries(adEntries.filter((e) => e.id !== id));
  };

  const filteredPreview = previewData.filter((r) =>
    !searchQuery ||
    r.invoiceNumber.includes(searchQuery) ||
    r.customer.includes(searchQuery) ||
    r.orderType.includes(searchQuery)
  );

  return (
    <div className="min-h-[100dvh] bg-[#FDF6EC]" style={{ direction: 'rtl' }}>
      <AdminSidebar activeItem="رفع الفواتير" />

      <div className="mr-[280px] min-h-[100dvh] flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#FDF6EC]/92 backdrop-blur border-b border-[rgba(212,168,68,0.15)] px-6 py-3">
          <h1 className="font-cairo font-bold text-xl text-[#2B2118]">معالجة الفواتير والبيانات</h1>
          <p className="font-tajawal text-xs text-[#8C5E3C] mt-1">
            {isProcessing ? 'جاري المعالجة...' : isProcessed ? `تم استخراج ${previewData.length} سجل` : 'ارفع الملفات لبدء المعالجة'}
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-1 bg-white/70 rounded-xl border border-[rgba(212,168,68,0.15)] p-1 overflow-x-auto">
            {[
              { key: 'upload' as const, label: 'رفع ومعالجة', icon: UploadCloud },
              { key: 'preview' as const, label: 'معاينة البيانات', icon: Eye },
              { key: 'ads' as const, label: 'الإعلانات', icon: TrendingUp },
              { key: 'reports' as const, label: 'التقارير', icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-tajawal font-semibold text-sm transition-all flex-1 justify-center',
                  activeTab === tab.key
                    ? 'bg-[#D4A844] text-[#2B2118]'
                    : 'text-[#8C5E3C] hover:bg-[#D4A844]/10'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-4">
          <AnimatePresence mode="wait">
            {/* ─── Upload Tab ─────────────────────────────────────── */}
            {activeTab === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Upload Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !file && fileInputRef.current?.click()}
                  className={cn(
                    'relative rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all',
                    isDragging
                      ? 'border-[#D4A844] bg-[#D4A844]/5 scale-[1.01]'
                      : 'border-[#D4A844]/40 hover:border-[#D4A844]/70 bg-white/50 backdrop-blur'
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <motion.div
                    animate={{ scale: isDragging ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <UploadCloud className={cn(
                      'w-16 h-16 mx-auto mb-4',
                      isDragging ? 'text-[#D4A844]' : 'text-[#D4A844]/50'
                    )} />
                  </motion.div>
                  <p className="font-cairo font-semibold text-lg text-[#2B2118] mb-2">
                    اسحب الملفات هنا أو انقر للاختيار
                  </p>
                  <p className="font-tajawal text-sm text-[#8C5E3C] mb-4">
                    يدعم: XLSX, XLS, CSV, PDF — حتى 50 ملف
                  </p>
                  <button className="px-6 py-2 rounded-xl border-2 border-[#D4A844] text-[#D4A844] font-tajawal font-semibold text-sm hover:bg-[#D4A844]/10 transition-all">
                    اختيار الملفات
                  </button>
                </div>

                {/* Selected File */}
                <AnimatePresence>
                  {file && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white/70 backdrop-blur rounded-xl p-4 border border-[rgba(212,168,68,0.2)] flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-lg bg-[#D4A844]/10 flex items-center justify-center">
                        <FileSpreadsheet className="w-6 h-6 text-[#D4A844]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-tajawal font-semibold text-sm text-[#2B2118]">{file.name}</p>
                        <p className="font-mono text-xs text-[#8C5E3C]">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isProcessing ? (
                          <span className="font-tajawal text-sm text-[#D4A844]">جاري المعالجة...</span>
                        ) : isProcessed ? (
                          <span className="flex items-center gap-1 font-tajawal text-sm text-[#27AE60]">
                            <CheckCircle2 className="w-4 h-4" />
                            تم
                          </span>
                        ) : null}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                            setIsProcessed(false);
                            setPreviewData([]);
                            setProcessingStep(0);
                          }}
                          className="p-2 rounded-lg hover:bg-[#C0392B]/10 text-[#C0392B] transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Process Button */}
                {file && !isProcessing && !isProcessed && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleProcessAgain}
                    className="w-full py-3 rounded-xl bg-[#D4A844] text-[#2B2118] font-cairo font-bold hover:bg-[#E5B84B] transition-all shadow-gold hover:shadow-gold-lg"
                  >
                    معالجة
                  </motion.button>
                )}

                {/* Processing Progress */}
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2"
                  >
                    <div className="h-2 bg-[#F5E6D0] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#D4A844] rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(processingStep / 4) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="font-tajawal text-xs text-[#8C5E3C] text-center">
                      الخطوة {processingStep} من 4...
                    </p>
                  </motion.div>
                )}

                {/* Processing Pipeline */}
                <div className="bg-[#F5E6D0]/40 rounded-xl p-6 border border-[rgba(212,168,68,0.15)]">
                  <h3 className="font-cairo font-bold text-base text-[#2B2118] mb-6 text-center">خطوات المعالجة</h3>
                  <div className="flex items-start">
                    {steps.map((step, i) => (
                      <PipelineStep
                        key={step.label}
                        step={step}
                        index={i}
                        isLast={i === steps.length - 1}
                      />
                    ))}
                  </div>
                </div>

                {/* Processing Log */}
                {file && (
                  <div className="bg-white/70 backdrop-blur rounded-xl p-4 border border-[rgba(212,168,68,0.2)]">
                    <h3 className="font-cairo font-bold text-sm text-[#2B2118] mb-3">سجل المعالجة</h3>
                    <div className="space-y-2">
                      {[
                        { file: file.name, type: file.name.split('.').pop()?.toUpperCase() || 'UNK', records: '-', status: 'pending' as const },
                      ].map((log, i) => (
                        <div key={i} className="flex items-center gap-3 py-2 border-b border-[rgba(212,168,68,0.08)] last:border-0">
                          <FileText className="w-4 h-4 text-[#D4A844]" />
                          <span className="font-mono text-xs text-[#2B2118] flex-1 truncate">{log.file}</span>
                          <span className="font-mono text-[10px] text-[#8C5E3C]">{log.type}</span>
                          <span className="font-mono text-[10px] text-[#8C5E3C]">{isProcessed ? mockInvoices.length : '-'} سجل</span>
                          <span className={cn(
                            'px-2 py-0.5 rounded-full text-[10px] font-bold',
                            isProcessed ? 'bg-[#27AE60]/10 text-[#27AE60]' : isProcessing ? 'bg-[#D4A844]/10 text-[#D4A844]' : 'bg-[#8C5E3C]/5 text-[#8C5E3C]'
                          )}>
                            {isProcessed ? 'تم' : isProcessing ? 'جاري' : 'في الانتظار'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── Preview Tab ────────────────────────────────────── */}
            {activeTab === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {!isProcessed ? (
                  <div className="text-center py-16 bg-white/50 rounded-xl border border-[rgba(212,168,68,0.15)]">
                    <AlertCircle className="w-12 h-12 text-[#8C5E3C]/30 mx-auto mb-4" />
                    <p className="font-tajawal text-[#8C5E3C]">قم برفع ومعالجة الملف أولاً لعرض البيانات</p>
                  </div>
                ) : (
                  <>
                    {/* Validation Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-[#27AE60]/10 rounded-xl p-4 border border-[#27AE60]/20 text-center">
                        <p className="font-cairo font-bold text-2xl text-[#27AE60]">
                          {previewData.filter((d) => d.status === 'valid').length}
                        </p>
                        <p className="font-tajawal text-xs text-[#27AE60] mt-1">صحيح</p>
                      </div>
                      <div className="bg-[#F39C12]/10 rounded-xl p-4 border border-[#F39C12]/20 text-center">
                        <p className="font-cairo font-bold text-2xl text-[#F39C12]">
                          {previewData.filter((d) => d.status === 'warning').length}
                        </p>
                        <p className="font-tajawal text-xs text-[#F39C12] mt-1">تحذير</p>
                      </div>
                      <div className="bg-[#C0392B]/10 rounded-xl p-4 border border-[#C0392B]/20 text-center">
                        <p className="font-cairo font-bold text-2xl text-[#C0392B]">
                          {previewData.filter((d) => d.status === 'error').length}
                        </p>
                        <p className="font-tajawal text-xs text-[#C0392B] mt-1">خطأ</p>
                      </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C5E3C]" />
                      <input
                        type="text"
                        placeholder="بحث في البيانات..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pr-10 pl-4 rounded-lg bg-white/70 border border-[rgba(212,168,68,0.2)] font-tajawal text-sm focus:outline-none focus:border-[#D4A844] focus:ring-1 focus:ring-[#D4A844]/30 transition-all"
                      />
                    </div>

                    {/* Data Table */}
                    <div className="bg-white/70 backdrop-blur rounded-xl border border-[rgba(212,168,68,0.2)] overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-[#2B2118] text-[#FDF6EC]">
                              <th className="px-4 py-3 text-right font-cairo text-sm font-bold">رقم الفاتورة</th>
                              <th className="px-4 py-3 text-right font-cairo text-sm font-bold">التاريخ</th>
                              <th className="px-4 py-3 text-right font-cairo text-sm font-bold">الوقت</th>
                              <th className="px-4 py-3 text-right font-cairo text-sm font-bold">نوع الطلب</th>
                              <th className="px-4 py-3 text-right font-cairo text-sm font-bold">نوع الدفع</th>
                              <th className="px-4 py-3 text-right font-cairo text-sm font-bold">العميل</th>
                              <th className="px-4 py-3 text-right font-cairo text-sm font-bold">المبلغ</th>
                              <th className="px-4 py-3 text-center font-cairo text-sm font-bold">الحالة</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredPreview.map((row, i) => (
                              <motion.tr
                                key={row.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.03 }}
                                className={cn(
                                  'border-b border-[rgba(212,168,68,0.08)] hover:bg-[#D4A844]/5 transition-colors',
                                  i % 2 === 0 ? 'bg-[#FDF6EC]/50' : 'bg-white/50',
                                  row.status === 'error' && 'bg-[#C0392B]/5',
                                  row.status === 'warning' && 'bg-[#F39C12]/5'
                                )}
                              >
                                <td className="px-4 py-3 font-mono text-sm font-semibold">{row.invoiceNumber}</td>
                                <td className="px-4 py-3 font-tajawal text-sm text-[#8C5E3C]">{row.date}</td>
                                <td className="px-4 py-3 font-mono text-sm text-[#8C5E3C]">{row.time}</td>
                                <td className="px-4 py-3 font-tajawal text-sm">{row.orderType}</td>
                                <td className="px-4 py-3 font-tajawal text-sm">{row.paymentType}</td>
                                <td className="px-4 py-3 font-tajawal text-sm font-semibold">{row.customer}</td>
                                <td className="px-4 py-3 font-mono text-sm font-bold text-[#D4A844]">
                                  {row.amount > 0 ? `${row.amount} ر.س` : '-'}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <StatusDot status={row.status} />
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {filteredPreview.length === 0 && (
                        <div className="text-center py-8 text-[#8C5E3C]/50 font-tajawal">
                          لا توجد نتائج
                        </div>
                      )}
                      <div className="px-4 py-3 border-t border-[rgba(212,168,68,0.15)] flex items-center justify-between">
                        <p className="font-tajawal text-xs text-[#8C5E3C]">
                          عرض {filteredPreview.length} من {previewData.length} سجل
                        </p>
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 rounded-lg border border-[rgba(212,168,68,0.2)] text-[#8C5E3C] text-xs font-bold hover:bg-[#D4A844]/10 transition-all flex items-center gap-1.5">
                            <Download className="w-3.5 h-3.5" />
                            تصدير Excel
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* ─── Ads Tab ────────────────────────────────────────── */}
            {activeTab === 'ads' && (
              <motion.div
                key="ads"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Ad Entry Form */}
                <div className="bg-white/70 backdrop-blur rounded-xl p-6 border border-[rgba(212,168,68,0.2)]">
                  <h3 className="font-cairo font-bold text-base text-[#2B2118] mb-4">إدخال بيانات الإعلانات</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div>
                      <label className="block font-tajawal text-xs font-bold text-[#8C5E3C] mb-1">التاريخ</label>
                      <input
                        type="date"
                        value={adDate}
                        onChange={(e) => setAdDate(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-[#FDF6EC] border border-[rgba(140,94,60,0.2)] font-tajawal text-sm focus:outline-none focus:border-[#D4A844] focus:ring-1 focus:ring-[#D4A844]/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-tajawal text-xs font-bold text-[#8C5E3C] mb-1">المنصة</label>
                      <div className="relative">
                        <select
                          value={adPlatform}
                          onChange={(e) => setAdPlatform(e.target.value)}
                          className="w-full h-10 pl-8 pr-3 rounded-lg bg-[#FDF6EC] border border-[rgba(140,94,60,0.2)] font-tajawal text-sm focus:outline-none focus:border-[#D4A844] appearance-none cursor-pointer"
                        >
                          <option value="">اختر</option>
                          {platforms.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C5E3C] pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block font-tajawal text-xs font-bold text-[#8C5E3C] mb-1">اسم الحملة</label>
                      <input
                        type="text"
                        value={adCampaign}
                        onChange={(e) => setAdCampaign(e.target.value)}
                        placeholder="اسم الحملة"
                        className="w-full h-10 px-3 rounded-lg bg-[#FDF6EC] border border-[rgba(140,94,60,0.2)] font-tajawal text-sm focus:outline-none focus:border-[#D4A844] focus:ring-1 focus:ring-[#D4A844]/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-tajawal text-xs font-bold text-[#8C5E3C] mb-1">المبلغ (ر.س)</label>
                      <input
                        type="number"
                        value={adAmount}
                        onChange={(e) => setAdAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full h-10 px-3 rounded-lg bg-[#FDF6EC] border border-[rgba(140,94,60,0.2)] font-mono text-sm focus:outline-none focus:border-[#D4A844] focus:ring-1 focus:ring-[#D4A844]/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-tajawal text-xs font-bold text-[#8C5E3C] mb-1">الوصول</label>
                      <input
                        type="number"
                        value={adReach}
                        onChange={(e) => setAdReach(e.target.value)}
                        placeholder="0"
                        className="w-full h-10 px-3 rounded-lg bg-[#FDF6EC] border border-[rgba(140,94,60,0.2)] font-mono text-sm focus:outline-none focus:border-[#D4A844] focus:ring-1 focus:ring-[#D4A844]/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-tajawal text-xs font-bold text-[#8C5E3C] mb-1">النتائج</label>
                      <input
                        type="number"
                        value={adResults}
                        onChange={(e) => setAdResults(e.target.value)}
                        placeholder="0"
                        className="w-full h-10 px-3 rounded-lg bg-[#FDF6EC] border border-[rgba(140,94,60,0.2)] font-mono text-sm focus:outline-none focus:border-[#D4A844] focus:ring-1 focus:ring-[#D4A844]/30 transition-all"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-3">
                    <button
                      onClick={() => setActiveTab('reports')}
                      className="px-4 py-2 rounded-lg border border-[#D4A844] text-[#D4A844] font-tajawal font-semibold text-sm hover:bg-[#D4A844]/10 transition-all"
                    >
                      تقرير الإعلانات
                    </button>
                    <button
                      onClick={handleAddAdEntry}
                      className="px-6 py-2 rounded-lg bg-[#D4A844] text-[#2B2118] font-cairo font-bold text-sm hover:bg-[#E5B84B] transition-all shadow-gold hover:shadow-gold-lg flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة
                    </button>
                  </div>
                </div>

                {/* Existing Ad Entries Table */}
                <div className="bg-white/70 backdrop-blur rounded-xl border border-[rgba(212,168,68,0.2)] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[rgba(212,168,68,0.15)]">
                    <h3 className="font-cairo font-bold text-sm text-[#2B2118]">سجل الإعلانات</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#F5E6D0]/50">
                          <th className="px-4 py-3 text-right font-cairo text-xs font-bold text-[#8C5E3C]">التاريخ</th>
                          <th className="px-4 py-3 text-right font-cairo text-xs font-bold text-[#8C5E3C]">المنصة</th>
                          <th className="px-4 py-3 text-right font-cairo text-xs font-bold text-[#8C5E3C]">الحملة</th>
                          <th className="px-4 py-3 text-right font-cairo text-xs font-bold text-[#8C5E3C]">المبلغ</th>
                          <th className="px-4 py-3 text-right font-cairo text-xs font-bold text-[#8C5E3C]">الوصول</th>
                          <th className="px-4 py-3 text-right font-cairo text-xs font-bold text-[#8C5E3C]">النتائج</th>
                          <th className="px-4 py-3 text-center font-cairo text-xs font-bold text-[#8C5E3C]">إجراء</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adEntries.map((entry, i) => (
                          <tr
                            key={entry.id}
                            className={cn(
                              'border-b border-[rgba(212,168,68,0.08)] hover:bg-[#D4A844]/5 transition-colors',
                              i % 2 === 0 ? 'bg-white/30' : 'bg-[#FDF6EC]/30'
                            )}
                          >
                            <td className="px-4 py-3 font-mono text-sm text-[#2B2118]">{entry.date}</td>
                            <td className="px-4 py-3 font-tajawal text-sm">
                              <span className={cn(
                                'px-2 py-0.5 rounded text-[10px] font-bold',
                                entry.platform === 'Instagram' && 'bg-[#D4652A]/10 text-[#D4652A]',
                                entry.platform === 'Snapchat' && 'bg-[#F39C12]/10 text-[#F39C12]',
                                entry.platform === 'TikTok' && 'bg-[#2B2118]/10 text-[#2B2118]',
                                entry.platform === 'Facebook' && 'bg-[#5B8FA8]/10 text-[#5B8FA8]',
                              )}>
                                {entry.platform}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-tajawal text-sm text-[#2B2118]">{entry.campaignName}</td>
                            <td className="px-4 py-3 font-mono text-sm font-bold text-[#D4A844]">{entry.amount} ر.س</td>
                            <td className="px-4 py-3 font-mono text-sm text-[#8C5E3C]">{entry.reach.toLocaleString()}</td>
                            <td className="px-4 py-3 font-mono text-sm text-[#8C5E3C]">{entry.results.toLocaleString()}</td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleDeleteAdEntry(entry.id)}
                                className="p-1.5 rounded-md hover:bg-[#C0392B]/10 text-[#C0392B] transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── Reports Tab ────────────────────────────────────── */}
            {activeTab === 'reports' && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {reportCards.map((report, i) => (
                    <motion.div
                      key={report.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                      className="bg-white/70 backdrop-blur rounded-xl p-5 border border-[rgba(212,168,68,0.2)] shadow-glass hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${report.color}15` }}
                        >
                          <report.icon className="w-6 h-6" style={{ color: report.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-cairo font-bold text-sm text-[#2B2118] mb-1">{report.title}</h4>
                          <p className="font-tajawal text-xs text-[#8C5E3C] leading-relaxed mb-3">
                            {report.description}
                          </p>
                          <a
                            href={report.href}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D4A844]/10 text-[#D4A844] font-tajawal font-bold text-xs hover:bg-[#D4A844] hover:text-[#2B2118] transition-all group-hover:shadow-md"
                          >
                            <Download className="w-3.5 h-3.5" />
                            تحميل
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Download Center Table */}
                <div className="bg-white/70 backdrop-blur rounded-xl border border-[rgba(212,168,68,0.2)] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[rgba(212,168,68,0.15)]">
                    <h3 className="font-cairo font-bold text-sm text-[#2B2118]">الملفات المتاحة للتنزيل</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#F5E6D0]/50">
                          <th className="px-4 py-3 text-right font-cairo text-xs font-bold text-[#8C5E3C]">الملف</th>
                          <th className="px-4 py-3 text-right font-cairo text-xs font-bold text-[#8C5E3C]">النوع</th>
                          <th className="px-4 py-3 text-right font-cairo text-xs font-bold text-[#8C5E3C]">التاريخ</th>
                          <th className="px-4 py-3 text-right font-cairo text-xs font-bold text-[#8C5E3C]">الحجم</th>
                          <th className="px-4 py-3 text-center font-cairo text-xs font-bold text-[#8C5E3C]">تنزيل</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'تقرير المبيعات — يونيو 2024', type: 'PDF', date: '2024-06-18', size: '2.4 MB' },
                          { name: 'بيانات المبيعات — يونيو 2024', type: 'Excel', date: '2024-06-18', size: '1.1 MB' },
                          { name: 'قاعدة البيانات — نسخة كاملة', type: 'CSV', date: '2024-06-18', size: '3.2 MB' },
                          { name: 'تحليل الإعلانات', type: 'PDF', date: '2024-06-18', size: '1.8 MB' },
                        ].map((file, i) => (
                          <tr
                            key={i}
                            className={cn(
                              'border-b border-[rgba(212,168,68,0.08)] hover:bg-[#D4A844]/5 transition-colors',
                              i % 2 === 0 ? 'bg-white/30' : 'bg-[#FDF6EC]/30'
                            )}
                          >
                            <td className="px-4 py-3 font-tajawal text-sm font-semibold text-[#2B2118]">{file.name}</td>
                            <td className="px-4 py-3">
                              <span className={cn(
                                'px-2 py-0.5 rounded text-[10px] font-bold',
                                file.type === 'PDF' && 'bg-[#C0392B]/10 text-[#C0392B]',
                                file.type === 'Excel' && 'bg-[#27AE60]/10 text-[#27AE60]',
                                file.type === 'CSV' && 'bg-[#5B8FA8]/10 text-[#5B8FA8]',
                              )}>
                                {file.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-[#8C5E3C]">{file.date}</td>
                            <td className="px-4 py-3 font-mono text-xs text-[#8C5E3C]">{file.size}</td>
                            <td className="px-4 py-3 text-center">
                              <button className="p-2 rounded-lg hover:bg-[#D4A844]/15 text-[#D4A844] transition-all">
                                <Download className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
