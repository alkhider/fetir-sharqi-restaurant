// Real customer names scraped from Google Maps reviews
// Source: https://maps.app.goo.gl/G7P4x69i9DF3rBat9
export const realCustomerNames = [
  { name: 'Esraa Elgaafary', phone: '055*******' },
  { name: 'Abo Yazeed', phone: '050*******' },
  { name: 'Mohamed Elnagar', phone: '054*******' },
  { name: 'Tarek Medhat', phone: '056*******' },
  { name: 'Ameer Almohammaedi', phone: '057*******' },
  { name: 'Asrar A.', phone: '058*******' },
  { name: 'Hend Ahmad', phone: '059*******' },
  { name: 'NOUF ALGHAMDI', phone: '055*******' },
];

// Real order types from the restaurant
export const orderTypes = ['سفري', 'محلي', 'كيتا', 'هنجر ستيشن'] as const;
export type OrderType = typeof orderTypes[number];

// Real payment methods
export const paymentMethods = ['نقدي', 'شبكة', 'مدى', 'فيزا'] as const;
export type PaymentMethod = typeof paymentMethods[number];

// Order statuses
export const orderStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'] as const;
export type OrderStatus = typeof orderStatuses[number];

// Real menu items for orders (based on actual menu)
interface MenuItem {
  name: string;
  price: number;
  qty: number;
  size: string;
}

const realMenuItems: MenuItem[][] = [
  // Order 1: مشلتت + حلو
  [
    { name: 'مشلتت', price: 35, qty: 1, size: 'وسط' },
    { name: 'فطيرة قشطة وعسل', price: 23, qty: 1, size: 'صغير' },
    { name: 'شاي', price: 1, qty: 2, size: '' },
  ],
  // Order 2: مكس لحوم + بيتزا
  [
    { name: 'فطيرة مكس لحوم', price: 33, qty: 1, size: 'كبير' },
    { name: 'بيتزا سجق', price: 32, qty: 1, size: 'وسط' },
    { name: 'بيبسي', price: 2.5, qty: 1, size: '' },
  ],
  // Order 3: سجق + حواوشي
  [
    { name: 'فطيرة سجق', price: 35, qty: 1, size: 'وسط' },
    { name: 'حواوشي لحم', price: 19, qty: 2, size: '' },
    { name: 'كريب مكس لحوم', price: 22, qty: 1, size: '' },
  ],
  // Order 4: دجاج فاهيتا + كريب
  [
    { name: 'فطيرة دجاج فاهيتا', price: 30, qty: 1, size: 'كبير' },
    { name: 'كريب دجاج رانش', price: 20, qty: 1, size: '' },
    { name: 'مشوية تقليدية', price: 10, qty: 1, size: '' },
  ],
  // Order 5: مشلتت بر + حلو
  [
    { name: 'مشلتت بر', price: 45, qty: 1, size: 'وسط' },
    { name: 'فطيرة نوتيلا', price: 24, qty: 1, size: 'صغير' },
    { name: 'كينزا', price: 2.5, qty: 1, size: '' },
  ],
  // Order 6: مكس جبن + بيتزا خضار
  [
    { name: 'فطيرة مكس جبن', price: 29, qty: 1, size: 'كبير' },
    { name: 'بيتزا خضار', price: 22, qty: 1, size: 'وسط' },
    { name: 'ماء', price: 0.5, qty: 2, size: '' },
  ],
  // Order 7: بسطرمة + فرانكفورتر
  [
    { name: 'فطيرة بسطرمة', price: 35, qty: 1, size: 'وسط' },
    { name: 'فطيرة فرانكفورتر', price: 30, qty: 1, size: 'صغير' },
    { name: 'شاي', price: 1, qty: 1, size: '' },
  ],
  // Order 8: لحم مفروم + بطاطس
  [
    { name: 'فطيرة لحم مفروم', price: 33, qty: 1, size: 'كبير' },
    { name: 'مشوية فرانكفورتر', price: 14, qty: 1, size: '' },
    { name: 'بيبسي', price: 2.5, qty: 1, size: '' },
  ],
  // Order 9: وش بيتزا + رول
  [
    { name: 'فطيرة مكس لحوم وش بيتزا', price: 35, qty: 1, size: 'كبير' },
    { name: 'فطيرة سجق رول', price: 12, qty: 2, size: '' },
    { name: 'كينزا', price: 2.5, qty: 1, size: '' },
  ],
  // Order 10: دجاج فاهيتا كيري + بستاشيو
  [
    { name: 'فطيرة دجاج فاهيتا كيري', price: 32, qty: 1, size: 'كبير' },
    { name: 'فطيرة بستاشيو', price: 25, qty: 1, size: 'صغير' },
    { name: 'شاي', price: 1, qty: 1, size: '' },
  ],
  // Order 11: حواوشي دجاج + كريب سجق
  [
    { name: 'حواوشي دجاج', price: 18, qty: 2, size: '' },
    { name: 'كريب سجق', price: 22, qty: 1, size: '' },
    { name: 'ماء', price: 0.5, qty: 1, size: '' },
  ],
  // Order 12: سجق بسطرمة + نوتيلا مارشميلو
  [
    { name: 'فطيرة سجق بسطرمة', price: 38, qty: 1, size: 'وسط' },
    { name: 'فطيرة نوتيلا مارشميلو', price: 27, qty: 1, size: 'صغير' },
    { name: 'بيبسي', price: 2.5, qty: 2, size: '' },
  ],
  // Order 13: بيتزا دجاج فاهيتا + مشلتت
  [
    { name: 'بيتزا دجاج فاهيتا', price: 27, qty: 1, size: 'وسط' },
    { name: 'مشلتت', price: 35, qty: 1, size: 'صغير' },
    { name: 'شاي', price: 1, qty: 2, size: '' },
  ],
  // Order 14: كريب زنجر + حواوشي لحم
  [
    { name: 'كريب زنجر حار', price: 22, qty: 1, size: '' },
    { name: 'حواوشي لحم', price: 19, qty: 1, size: '' },
    { name: 'كينزا', price: 2.5, qty: 1, size: '' },
  ],
  // Order 15: بيتزا لحم مفروم + قشطة وعسل
  [
    { name: 'بيتزا لحم مفروم', price: 32, qty: 1, size: 'كبير' },
    { name: 'فطيرة قشطة وعسل', price: 23, qty: 1, size: 'صغير' },
    { name: 'ماء', price: 0.5, qty: 1, size: '' },
  ],
  // Order 16: مشلتت بر + كاستر + شاي
  [
    { name: 'مشلتت بر', price: 45, qty: 1, size: 'وسط' },
    { name: 'فطيرة كاستر', price: 20, qty: 1, size: 'صغير' },
    { name: 'شاي', price: 1, qty: 3, size: '' },
  ],
  // Order 17: مكس جبن وش بيتزا + سجق رول
  [
    { name: 'فطيرة مكس جبن وش بيتزا', price: 35, qty: 1, size: 'كبير' },
    { name: 'فطيرة سجق رول', price: 12, qty: 3, size: '' },
    { name: 'بيبسي', price: 2.5, qty: 2, size: '' },
  ],
  // Order 18: بسطرمة كيري + مشوية
  [
    { name: 'فطيرة بسطرمة كيري', price: 37, qty: 1, size: 'وسط' },
    { name: 'مشوية تقليدية', price: 10, qty: 2, size: '' },
    { name: 'ماء', price: 0.5, qty: 2, size: '' },
  ],
  // Order 19: فرانكفورتر + لوتس
  [
    { name: 'فطيرة فرانكفورتر', price: 30, qty: 1, size: 'كبير' },
    { name: 'فطيرة لوتس', price: 24, qty: 1, size: 'صغير' },
    { name: 'شاي', price: 1, qty: 1, size: '' },
  ],
  // Order 20: بيتزا سجق + دجاج فاهيتا + نوتيلا
  [
    { name: 'بيتزا سجق', price: 32, qty: 1, size: 'وسط' },
    { name: 'فطيرة دجاج فاهيتا', price: 30, qty: 1, size: 'صغير' },
    { name: 'فطيرة نوتيلا', price: 24, qty: 1, size: 'صغير' },
    { name: 'بيبسي', price: 2.5, qty: 1, size: '' },
    { name: 'ماء', price: 0.5, qty: 1, size: '' },
  ],
];

// Generate realistic mock orders using real customer names and real menu items
export function generateMockOrders(): MockOrder[] {
  const orders: MockOrder[] = [];
  const now = new Date();

  for (let i = 0; i < realMenuItems.length; i++) {
    const customer = realCustomerNames[i % realCustomerNames.length];
    const items = realMenuItems[i];
    const amount = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = +(amount * 0.15).toFixed(2);
    const total = +(amount + tax).toFixed(2);

    // Generate realistic timestamps (spread across today)
    const orderDate = new Date(now);
    orderDate.setMinutes(orderDate.getMinutes() - (i * 45 + Math.floor(Math.random() * 15)));

    orders.push({
      id: `#ORD-${15670 + i}`,
      customer: customer.name,
      phone: customer.phone,
      type: orderTypes[i % orderTypes.length],
      items: items.map(item => ({
        name: item.name,
        price: item.price,
        qty: item.qty,
        size: item.size,
      })),
      amount,
      tax,
      total,
      status: i < 2 ? 'pending' : i < 5 ? 'preparing' : i < 10 ? 'ready' : 'completed',
      payment: paymentMethods[i % paymentMethods.length],
      time: orderDate.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      date: orderDate.toISOString().split('T')[0],
      note: i === 0 ? 'بدون بصل' : i === 3 ? 'extra ranch sauce' : '',
    });
  }

  return orders;
}

// Export the Order interface for use in Operations.tsx
export interface MockOrder {
  id: string;
  customer: string;
  phone: string;
  type: OrderType;
  items: { name: string; price: number; qty: number; size: string }[];
  amount: number;
  tax: number;
  total: number;
  status: OrderStatus;
  payment: PaymentMethod;
  time: string;
  date: string;
  note: string;
}
