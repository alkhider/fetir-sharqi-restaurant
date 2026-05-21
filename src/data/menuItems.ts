export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isHot?: boolean;
}

export interface MenuCategory {
  key: string;
  label: string;
  labelEn: string;
  image: string;
  items: MenuItem[];
}

export const categories: MenuCategory[] = [
  {
    key: "mushaltat",
    label: "فطير مشلتت",
    labelEn: "Mushaltat Pies",
    image: "/food-mushaltat.png",
    items: [
      {
        id: "m1",
        name: "فطيرة مشلتت وسط",
        description: "عجينة المشلتت اللذيذة من أفخم أنواع الدقيق والزبد البقري",
        price: 22,
        category: "mushaltat",
        image: "/food-mushaltat.png",
        isHot: true,
      },
      {
        id: "m2",
        name: "فطيرة مشلتت كبير",
        description: "عجينة المشلتت اللذيذة حجم كبير، مثالية للمشاركة",
        price: 28,
        category: "mushaltat",
        image: "/food-mushaltat.png",
      },
      {
        id: "m3",
        name: "فطيرة مكس جبن",
        description: "جبنة موزاريلا حقيقية مع جبنة رومي وشيدر",
        price: 26,
        category: "mushaltat",
        image: "/food-mushaltat.png",
        isHot: true,
      },
      {
        id: "m4",
        name: "فطيرة سجق",
        description: "سجق بقري محلي مع بهارات شرقية",
        price: 27,
        category: "mushaltat",
        image: "/food-hadik.png",
        isHot: true,
      },
      {
        id: "m5",
        name: "فطيرة بسطرمة كيري",
        description: "بسطرمة مدخنة مع جبنة كيري كريمية",
        price: 32,
        category: "mushaltat",
        image: "/food-hadik.png",
      },
      {
        id: "m6",
        name: "فطيرة دجاج فاهيتا",
        description: "دجاج متبل فاهيتا مع فلفل ألوان وجبنة",
        price: 28,
        category: "mushaltat",
        image: "/food-hadik.png",
        isHot: true,
      },
      {
        id: "m7",
        name: "فطيرة دجاج فاهيتا كيري",
        description: "دجاج فاهيتا مع جبنة كيري الكريمية",
        price: 32,
        category: "mushaltat",
        image: "/food-hadik.png",
      },
      {
        id: "m8",
        name: "فطيرة لحوم مكس",
        description: "لحم بقري بلدي + سجق + بسطرمة مع جبنة رومي",
        price: 29,
        category: "mushaltat",
        image: "/food-hadik.png",
      },
      {
        id: "m9",
        name: "فطيرة البستاشيو",
        description: "فطيرة مشلتت بالبستاشيو المفروم الطازج",
        price: 25,
        category: "mushaltat",
        image: "/food-mushaltat.png",
      },
    ],
  },
  {
    key: "savory",
    label: "فطير حادق",
    labelEn: "Savory Pies",
    image: "/food-hadik.png",
    items: [
      {
        id: "s1",
        name: "فطيرة سجق كيري",
        description: "سجق بقري محلي مع جبنة كيري الكريمية",
        price: 35,
        category: "savory",
        image: "/food-hadik.png",
      },
      {
        id: "s2",
        name: "فطيرة مكس جبن وش بيتزا",
        description: "مزيج جبن رومي وموزاريلا مع وجه بيتزا",
        price: 37,
        category: "savory",
        image: "/food-pizza.png",
      },
      {
        id: "s3",
        name: "حواوشي لحم",
        description: "لحم بقري مفروم متبل شرقي",
        price: 28,
        category: "savory",
        image: "/food-hawawshi.png",
      },
      {
        id: "s4",
        name: "حواوشي دجاج",
        description: "دجاج متبل مع بهارات شرقية",
        price: 25,
        category: "savory",
        image: "/food-hawawshi.png",
      },
      {
        id: "s5",
        name: "كريب دجاج رانش",
        description: "دجاج مشوي مع صوص رانش وخضار",
        price: 30,
        category: "savory",
        image: "/food-crepe.png",
      },
    ],
  },
  {
    key: "sweet",
    label: "فطير حلو",
    labelEn: "Sweet Pies",
    image: "/food-helw.png",
    items: [
      {
        id: "sw1",
        name: "فطيرة كاستر",
        description: "فطيرة حلوة بالكاستر الكريمي الطازج",
        price: 18,
        category: "sweet",
        image: "/food-helw.png",
      },
      {
        id: "sw2",
        name: "عسل أسود",
        description: "إضافة عسل أسود طبيعي",
        price: 3,
        category: "sweet",
        image: "/food-helw.png",
      },
      {
        id: "sw3",
        name: "قشطة",
        description: "إضافة قشطة طازجة كريمية",
        price: 5,
        category: "sweet",
        image: "/food-helw.png",
      },
      {
        id: "sw4",
        name: "مش",
        description: "إضافة جبنة مش طازجة",
        price: 4,
        category: "sweet",
        image: "/food-helw.png",
      },
    ],
  },
  {
    key: "crepes",
    label: "كريب",
    labelEn: "Crepes",
    image: "/food-crepe.png",
    items: [
      {
        id: "c1",
        name: "كريب دجاج رانش",
        description: "دجاج مشوي مع صوص رانش وخضار طازج",
        price: 30,
        category: "crepes",
        image: "/food-crepe.png",
      },
      {
        id: "c2",
        name: "كريب دجاج باربيكيو",
        description: "دجاج مشوي بصوص الباربيكيو المدخن",
        price: 32,
        category: "crepes",
        image: "/food-crepe.png",
      },
    ],
  },
  {
    key: "pizza",
    label: "بيتزا",
    labelEn: "Pizza",
    image: "/food-pizza.png",
    items: [
      {
        id: "p1",
        name: "بيتزا مارغريتا",
        description: "جبنة موزاريلا مع صوص طماطم طازج",
        price: 28,
        category: "pizza",
        image: "/food-pizza.png",
      },
      {
        id: "p2",
        name: "بيتزا ببروني",
        description: "ببروني مع جبنة موزاريلا stretchy",
        price: 35,
        category: "pizza",
        image: "/food-pizza.png",
      },
    ],
  },
  {
    key: "hawawshi",
    label: "حواوشي",
    labelEn: "Hawawshi",
    image: "/food-hawawshi.png",
    items: [
      {
        id: "h1",
        name: "حواوشي لحم",
        description: "لحم بقري مفروم متبل شرقي",
        price: 28,
        category: "hawawshi",
        image: "/food-hawawshi.png",
      },
      {
        id: "h2",
        name: "حواوشي دجاج",
        description: "دجاج متبل مع بهارات شرقية",
        price: 25,
        category: "hawawshi",
        image: "/food-hawawshi.png",
      },
      {
        id: "h3",
        name: "حواوشي مكس",
        description: "لحم + دجاج مكس مع بهارات مشكلة",
        price: 30,
        category: "hawawshi",
        image: "/food-hawawshi.png",
      },
    ],
  },
  {
    key: "extras",
    label: "إضافات",
    labelEn: "Extras",
    image: "/food-mushaltat.png",
    items: [
      {
        id: "e1",
        name: "كينزا",
        description: "قطعة إضافية من الكينزا",
        price: 2,
        category: "extras",
        image: "/food-mushaltat.png",
      },
      {
        id: "e2",
        name: "جبنة رومي إضافية",
        description: "إضافة جبنة رومي إضافية",
        price: 5,
        category: "extras",
        image: "/food-mushaltat.png",
      },
      {
        id: "e3",
        name: "خضروات إضافية",
        description: "إضافة خضروات طازجة",
        price: 3,
        category: "extras",
        image: "/food-mushaltat.png",
      },
    ],
  },
];

export const allItems: MenuItem[] = categories.flatMap((c) => c.items);

export const hotItemIds = new Set([
  "m1",
  "m3",
  "m4",
  "m6",
]);
