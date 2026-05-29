import { useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Plus, Pencil, Trash2, Tag } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { cn } from '@/lib/utils';

export default function OffersManagement() {
  const [offers] = useState([
    { id: 1, title: 'عرض مشلتت + شاي', discount: '20%', active: true },
    { id: 2, title: 'عرض عائلي كبير', discount: '15%', active: true },
    { id: 3, title: 'عرض الغداء', discount: '10%', active: false },
  ]);

  return (
    <div className="min-h-[100dvh] bg-[#F5EFE6]" style={{ direction: 'rtl' }}>
      <AdminSidebar />

      <div className="mr-[280px] bg-white border-b border-[#E5D9C8] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Megaphone className="w-6 h-6 text-[#D4A844]" />
            <h1 className="font-bold text-xl text-[#2B2118]">إدارة العروض</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4A844] text-white font-bold text-sm">
            <Plus className="w-4 h-4" />
            إضافة عرض
          </button>
        </div>
      </div>

      <div className="mr-[280px] p-6">
        <div className="bg-white rounded-xl border border-[#E5D9C8] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F5EFE6] border-b border-[#E5D9C8]">
              <tr>
                <th className="text-right px-4 py-3 font-bold">العرض</th>
                <th className="text-right px-4 py-3 font-bold">الخصم</th>
                <th className="text-right px-4 py-3 font-bold">الحالة</th>
                <th className="text-right px-4 py-3 font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id} className="border-b border-[#F5EFE6]">
                  <td className="px-4 py-3 font-bold">{offer.title}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-[#D4A844]/15 text-[#D4A844] rounded-md text-xs font-bold">
                      {offer.discount}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'px-2 py-1 rounded-md text-xs font-bold',
                      offer.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                    )}>
                      {offer.active ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg bg-[#F5EFE6] text-[#8C7A66] hover:bg-[#D4A844] hover:text-white">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
