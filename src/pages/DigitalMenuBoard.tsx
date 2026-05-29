import { useState, useEffect } from 'react';
import { allItems, categories } from '@/data/menuItems';

export default function DigitalMenuBoard() {
  const [currentCategory, setCurrentCategory] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCategory((prev) => (prev + 1) % categories.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const cat = categories[currentCategory];
  const items = allItems.filter((item) => item.category === cat.key);

  return (
    <div className="min-h-[100dvh] bg-[#2B2118] text-[#FDF6EC] flex flex-col items-center justify-center p-8" style={{ direction: 'rtl' }}>
      <h1 className="text-6xl font-cairo font-bold text-[#D4A844] mb-8">فطير شرقي</h1>
      <h2 className="text-3xl font-tajawal font-bold mb-8">{cat.label}</h2>
      <div className="grid grid-cols-2 gap-6 max-w-4xl">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-[#FDF6EC]/10 rounded-xl p-4">
            <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
            <div>
              <h3 className="font-bold text-xl">{item.name}</h3>
              <p className="text-[#D4A844] font-bold text-lg">{item.price} ر.س</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
