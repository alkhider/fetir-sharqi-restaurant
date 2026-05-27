export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  priceLarge?: number;
  calories: number;
  caloriesLarge?: number;
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

// ─── فطير مشلتت (2 items) ───
const mushaltatItems: MenuItem[] = [
  {
    id: "m1", name: "مشلتت", description: "عجينة المشلتت الأصلية بالسمن البقري والزبدة. يقدم مع عسل وجبن.",
    price: 22, priceLarge: 30, calories: 620, caloriesLarge: 920,
    category: "mushaltat", image: "/food-mushaltat.png", isHot: true,
  },
  {
    id: "m2", name: "مشلتت بر", description: "مشلتت بسمن بقري وزبدة بقري بدون أي دهون نباتية. يقدم مع عسل وجبن.",
    price: 45, calories: 850, category: "mushaltat", image: "/food-mushaltat.png",
  },
];

// ─── الفطير الحادق (12 items) ───
const savoryItems: MenuItem[] = [
  {
    id: "s1", name: "فطيرة مكس لحوم", description: "لحم بقري، سجق بلدي، بسطرمة، فرانكفورتر، جبن موزريلا، جبن رومي، طماطم، فلفل، زيتون",
    price: 35, priceLarge: 47, calories: 490, caloriesLarge: 640,
    category: "savory", image: "/food-savory.png", isHot: true,
  },
  {
    id: "s2", name: "فطيرة مكس جبن", description: "جبن شيدر، جبن موزريلا، جبن رومي، جبن كيري، طماطم، فلفل، زيتون",
    price: 29, priceLarge: 37, calories: 490, caloriesLarge: 640,
    category: "savory", image: "/food-savory.png", isHot: true,
  },
  {
    id: "s3", name: "فطيرة دجاج فاهيتا", description: "دجاج فاهيتا، جبن موزريلا، جبن رومي، طماطم، فلفل، زيتون. يقدم مع صوص رانش",
    price: 30, priceLarge: 39, calories: 400, caloriesLarge: 520,
    category: "savory", image: "/food-savory.png",
  },
  {
    id: "s4", name: "فطيرة دجاج فاهيتا كيري", description: "دجاج فاهيتا، جبن موزريلا، جبن رومي، جبن كيري، طماطم، فلفل، زيتون. يقدم مع صوص رانش",
    price: 32, priceLarge: 41, calories: 520, caloriesLarge: 670,
    category: "savory", image: "/food-savory.png",
  },
  {
    id: "s5", name: "فطيرة سجق", description: "سجق بلدي، جبن موزريلا، جبن رومي، طماطم، فلفل، زيتون",
    price: 35, priceLarge: 45, calories: 490, caloriesLarge: 640,
    category: "savory", image: "/food-savory.png", isHot: true,
  },
  {
    id: "s6", name: "فطيرة سجق كيري", description: "سجق بلدي، جبن موزريلا، جبن رومي، جبن كيري، طماطم، فلفل، زيتون",
    price: 37, priceLarge: 48, calories: 520, caloriesLarge: 640,
    category: "savory", image: "/food-savory.png",
  },
  {
    id: "s7", name: "فطيرة بسطرمة", description: "بسطرمة، جبن موزريلا، جبن رومي، طماطم، فلفل، زيتون",
    price: 35, priceLarge: 46, calories: 490, caloriesLarge: 640,
    category: "savory", image: "/food-savory.png",
  },
  {
    id: "s8", name: "فطيرة بسطرمة كيري", description: "بسطرمة، جبن موزريلا، جبن رومي، جبن كيري، طماطم، فلفل، زيتون",
    price: 37, priceLarge: 49, calories: 520, caloriesLarge: 670,
    category: "savory", image: "/food-savory.png",
  },
  {
    id: "s9", name: "فطيرة فرانكفورتر", description: "فرانكفورتر، جبن موزريلا، جبن رومي، طماطم، فلفل، زيتون",
    price: 30, priceLarge: 39, calories: 470, caloriesLarge: 610,
    category: "savory", image: "/food-savory.png",
  },
  {
    id: "s10", name: "فطيرة سجق بسطرمة", description: "سجق بلدي، بسطرمة، جبن موزريلا، جبن رومي، طماطم، فلفل، زيتون",
    price: 38, priceLarge: 50, calories: 490, caloriesLarge: 640,
    category: "savory", image: "/food-savory.png",
  },
  {
    id: "s11", name: "فطيرة سجق بسطرمة كيري", description: "سجق بلدي، بسطرمة، جبن موزريلا، جبن رومي، جبن كيري، طماطم، فلفل، زيتون",
    price: 40, priceLarge: 53, calories: 520, caloriesLarge: 670,
    category: "savory", image: "/food-savory.png",
  },
  {
    id: "s12", name: "فطيرة لحم مفروم", description: "لحم مفروم، بصل مكرمل، جبن موزريلا، جبن رومي، طماطم، فلفل، زيتون",
    price: 33, priceLarge: 45, calories: 480, caloriesLarge: 620,
    category: "savory", image: "/food-savory.png",
  },
];

// ─── فطير وش بيتزا (12 items) ───
const pizzaFaceItems: MenuItem[] = [
  {
    id: "pf1", name: "فطيرة مكس لحوم وش بيتزا", description: "لحم بقري، سجق بلدي، بسطرمة، فرانكفورتر، جبن موزريلا، جبن رومي، طماطم، فلفل، زيتون",
    price: 40, priceLarge: 52, calories: 490, caloriesLarge: 640,
    category: "pizzaface", image: "/food-pizza.png", isHot: true,
  },
  {
    id: "pf2", name: "فطيرة دجاج فاهيتا وش بيتزا", description: "دجاج فاهيتا، جبن موزريلا، جبن رومي، طماطم، فلفل، زيتون. يقدم مع صوص رانش",
    price: 35, priceLarge: 45, calories: 400, caloriesLarge: 520,
    category: "pizzaface", image: "/food-pizza.png",
  },
  {
    id: "pf3", name: "فطيرة دجاج فاهيتا كيري وش بيتزا", description: "دجاج فاهيتا، جبن موزريلا، جبن رومي، جبن كيري، طماطم، فلفل، زيتون. يقدم مع صوص رانش",
    price: 38, priceLarge: 48, calories: 520, caloriesLarge: 680,
    category: "pizzaface", image: "/food-pizza.png",
  },
  {
    id: "pf4", name: "فطيرة سجق وش بيتزا", description: "سجق بلدي، جبن موزريلا، جبن رومي، طماطم، فلفل، زيتون",
    price: 40, priceLarge: 52, calories: 490, caloriesLarge: 640,
    category: "pizzaface", image: "/food-pizza.png",
  },
  {
    id: "pf5", name: "فطيرة سجق كيري وش بيتزا", description: "سجق بلدي، جبن موزريلا، جبن رومي، جبن كيري، طماطم، فلفل، زيتون",
    price: 42, priceLarge: 55, calories: 520, caloriesLarge: 680,
    category: "pizzaface", image: "/food-pizza.png",
  },
  {
    id: "pf6", name: "فطيرة بسطرمة وش بيتزا", description: "بسطرمة، جبن موزريلا، جبن رومي، طماطم، فلفل، زيتون",
    price: 40, priceLarge: 53, calories: 490, caloriesLarge: 640,
    category: "pizzaface", image: "/food-pizza.png",
  },
  {
    id: "pf7", name: "فطيرة بسطرمة كيري وش بيتزا", description: "بسطرمة، جبن موزريلا، جبن رومي، جبن كيري، طماطم، فلفل، زيتون",
    price: 42, priceLarge: 55, calories: 490, caloriesLarge: 640,
    category: "pizzaface", image: "/food-pizza.png",
  },
  {
    id: "pf8", name: "فطيرة مكس جبن وش بيتزا", description: "جبن شيدر، جبن موزريلا، جبن رومي، جبن كيري، طماطم، فلفل، زيتون",
    price: 35, priceLarge: 45, calories: 490, caloriesLarge: 640,
    category: "pizzaface", image: "/food-pizza.png",
  },
  {
    id: "pf9", name: "فطيرة فرانكفورتر وش بيتزا", description: "فرانكفورتر، جبن موزريلا، جبن رومي، طماطم، فلفل، زيتون",
    price: 35, priceLarge: 45, calories: 470, caloriesLarge: 610,
    category: "pizzaface", image: "/food-pizza.png",
  },
  {
    id: "pf10", name: "فطيرة سجق بسطرمة وش بيتزا", description: "سجق بلدي، بسطرمة، جبن موزريلا، جبن رومي، طماطم، فلفل، زيتون",
    price: 43, priceLarge: 56, calories: 490, caloriesLarge: 640,
    category: "pizzaface", image: "/food-pizza.png",
  },
  {
    id: "pf11", name: "فطيرة سجق بسطرمة كيري وش بيتزا", description: "سجق بلدي، بسطرمة، جبن موزريلا، جبن رومي، جبن كيري، طماطم، فلفل، زيتون",
    price: 45, priceLarge: 59, calories: 490, caloriesLarge: 640,
    category: "pizzaface", image: "/food-pizza.png",
  },
  {
    id: "pf12", name: "فطيرة لحم مفروم وش بيتزا", description: "لحم مفروم، بصل مكرمل، جبن موزريلا، جبن رومي، طماطم، فلفل، زيتون",
    price: 39, priceLarge: 50, calories: 480, caloriesLarge: 630,
    category: "pizzaface", image: "/food-pizza.png",
  },
];

// ─── البيتزا (10 items) ───
const pizzaItems: MenuItem[] = [
  {
    id: "pz1", name: "بيتزا مكس لحوم", description: "لحم مفروم، سجق بلدي، بسطرمة، فرانكفورتر، جبن موزريلا، طماطم، فلفل، زيتون، صوص بيتزا",
    price: 33, priceLarge: 43, calories: 650, caloriesLarge: 840,
    category: "pizza", image: "/food-pizza.png", isHot: true,
  },
  {
    id: "pz2", name: "بيتزا دجاج فاهيتا", description: "دجاج فاهيتا، جبن موزريلا، طماطم، فلفل، زيتون. يقدم مع صوص رانش",
    price: 27, priceLarge: 35, calories: 530, caloriesLarge: 680,
    category: "pizza", image: "/food-pizza.png",
  },
  {
    id: "pz3", name: "بيتزا مكس جبن", description: "جبن شيدر، جبن موزريلا، جبن رومي، جبن كيري، طماطم، فلفل، زيتون، صوص بيتزا",
    price: 27, priceLarge: 35, calories: 670, caloriesLarge: 870,
    category: "pizza", image: "/food-pizza.png",
  },
  {
    id: "pz4", name: "بيتزا سجق", description: "سجق بلدي، جبن موزريلا، طماطم، فلفل، زيتون، صوص بيتزا",
    price: 32, priceLarge: 41, calories: 670, caloriesLarge: 870,
    category: "pizza", image: "/food-pizza.png",
  },
  {
    id: "pz5", name: "بيتزا لحم مفروم", description: "لحم مفروم، بصل مكرمل، جبن موزريلا، طماطم، فلفل، زيتون",
    price: 32, priceLarge: 41, calories: 440, caloriesLarge: 570,
    category: "pizza", image: "/food-pizza.png",
  },
  {
    id: "pz6", name: "بيتزا بسطرمة", description: "بسطرمة، جبن موزريلا، فلفل، زيتون، صوص بيتزا",
    price: 32, priceLarge: 43, calories: 440, caloriesLarge: 570,
    category: "pizza", image: "/food-pizza.png",
  },
  {
    id: "pz7", name: "بيتزا فرانكفورتر", description: "فرانكفورتر، جبن موزريلا، طماطم، فلفل، زيتون، صوص بيتزا",
    price: 30, priceLarge: 39, calories: 440, caloriesLarge: 570,
    category: "pizza", image: "/food-pizza.png",
  },
  {
    id: "pz8", name: "بيتزا ببروني", description: "ببروني، جبن موزريلا، طماطم، فلفل، زيتون، صوص بيتزا",
    price: 32, priceLarge: 40, calories: 670, caloriesLarge: 870,
    category: "pizza", image: "/food-pizza.png",
  },
  {
    id: "pz9", name: "بيتزا مارقريتا", description: "جبن موزريلا، صوص بيتزا",
    price: 20, priceLarge: 26, calories: 350, caloriesLarge: 450,
    category: "pizza", image: "/food-pizza.png",
  },
  {
    id: "pz10", name: "بيتزا خضار", description: "جبن موزريلا، طماطم، فلفل، زيتون، صوص بيتزا",
    price: 22, priceLarge: 28, calories: 320, caloriesLarge: 410,
    category: "pizza", image: "/food-pizza.png",
  },
];

// ─── بيتزا بُر (10 items) ───
const pizzaBurItems: MenuItem[] = [
  {
    id: "pb1", name: "بيتزا مكس لحوم بر", description: "لحم مفروم، سجق بلدي، بسطرمة، فرانكفورتر، جبن موزريلا، طماطم، فلفل، زيتون، صوص بيتزا",
    price: 34, priceLarge: 44.2, calories: 550, caloriesLarge: 720,
    category: "pizzabur", image: "/food-pizza.png",
  },
  {
    id: "pb2", name: "بيتزا دجاج فاهيتا بر", description: "دجاج فاهيتا، جبن موزريلا، طماطم، فلفل، زيتون. يقدم مع صوص رانش",
    price: 28, priceLarge: 36.4, calories: 450, caloriesLarge: 580,
    category: "pizzabur", image: "/food-pizza.png",
  },
  {
    id: "pb3", name: "بيتزا مكس جبن بر", description: "جبن شيدر، جبن موزريلا، جبن رومي، جبن كيري، طماطم، فلفل، زيتون، صوص بيتزا",
    price: 28, priceLarge: 36.4, calories: 550, caloriesLarge: 720,
    category: "pizzabur", image: "/food-pizza.png",
  },
  {
    id: "pb4", name: "بيتزا سجق بر", description: "سجق بلدي، جبن موزريلا، طماطم، فلفل، زيتون، صوص بيتزا",
    price: 33, priceLarge: 42.9, calories: 550, caloriesLarge: 720,
    category: "pizzabur", image: "/food-pizza.png",
  },
  {
    id: "pb5", name: "بيتزا لحم مفروم بر", description: "لحم مفروم، بصل مكرمل، جبن موزريلا، طماطم، فلفل، زيتون",
    price: 33, priceLarge: 42.9, calories: 550, caloriesLarge: 720,
    category: "pizzabur", image: "/food-pizza.png",
  },
  {
    id: "pb6", name: "بيتزا بسطرمة بر", description: "بسطرمة، جبن موزريلا، فلفل، زيتون، صوص بيتزا",
    price: 33, priceLarge: 42.9, calories: 550, caloriesLarge: 720,
    category: "pizzabur", image: "/food-pizza.png",
  },
  {
    id: "pb7", name: "بيتزا فرانكفورتر بر", description: "فرانكفورتر، جبن موزريلا، طماطم، فلفل، زيتون، صوص بيتزا",
    price: 31, priceLarge: 40.3, calories: 550, caloriesLarge: 720,
    category: "pizzabur", image: "/food-pizza.png",
  },
  {
    id: "pb8", name: "بيتزا ببروني بر", description: "ببروني، جبن موزريلا، طماطم، فلفل، زيتون، صوص بيتزا",
    price: 33, priceLarge: 42.9, calories: 570, caloriesLarge: 740,
    category: "pizzabur", image: "/food-pizza.png",
  },
  {
    id: "pb9", name: "بيتزا مارقريتا بر", description: "جبن موزريلا، صوص بيتزا",
    price: 21, priceLarge: 27.3, calories: 320, caloriesLarge: 420,
    category: "pizzabur", image: "/food-pizza.png",
  },
  {
    id: "pb10", name: "بيتزا خضار بر", description: "جبن موزريلا، طماطم، فلفل، زيتون، صوص بيتزا",
    price: 22, priceLarge: 28.6, calories: 350, caloriesLarge: 460,
    category: "pizzabur", image: "/food-pizza.png",
  },
];

// ─── فطيرة رول (12 items) ───
const rollItems: MenuItem[] = [
  {
    id: "r1", name: "فطيرة مكس لحوم رول", description: "لحم بقري، سجق بلدي، بسطرمة، فرانكفورتر، جبن موزريلا، جبن رومي، طماطم، فلفل، زيتون",
    price: 13, priceLarge: 22, calories: 310, caloriesLarge: 400,
    category: "roll", image: "/food-roll.png",
  },
  {
    id: "r2", name: "فطيرة دجاج فاهيتا رول", description: "دجاج فاهيتا، جبن موزريلا، جبن رومي، طماطم، فلفل، زيتون. يقدم مع صوص رانش",
    price: 11, priceLarge: 20, calories: 280, caloriesLarge: 370,
    category: "roll", image: "/food-roll.png",
  },
  {
    id: "r3", name: "فطيرة دجاج فاهيتا كيري رول", description: "دجاج فاهيتا، جبن موزريلا، جبن رومي، جبن كيري، طماطم، فلفل، زيتون. يقدم مع صوص رانش",
    price: 12, priceLarge: 22, calories: 360, caloriesLarge: 470,
    category: "roll", image: "/food-roll.png",
  },
  {
    id: "r4", name: "فطيرة سجق رول", description: "سجق بلدي، جبن موزريلا، جبن رومي، طماطم، فلفل، زيتون",
    price: 12, priceLarge: 22, calories: 300, caloriesLarge: 390,
    category: "roll", image: "/food-roll.png",
  },
  {
    id: "r5", name: "فطيرة سجق كيري رول", description: "سجق بلدي، جبن موزريلا، جبن رومي، جبن كيري، طماطم، فلفل، زيتون",
    price: 13, priceLarge: 24, calories: 360, caloriesLarge: 470,
    category: "roll", image: "/food-roll.png",
  },
  {
    id: "r6", name: "فطيرة بسطرمة رول", description: "بسطرمة، جبن موزريلا، جبن رومي، طماطم، فلفل، زيتون",
    price: 13, priceLarge: 22, calories: 280, caloriesLarge: 370,
    category: "roll", image: "/food-roll.png",
  },
  {
    id: "r7", name: "فطيرة بسطرمة كيري رول", description: "بسطرمة، جبن موزريلا، جبن رومي، جبن كيري، طماطم، فلفل، زيتون",
    price: 14, priceLarge: 24, calories: 280, caloriesLarge: 370,
    category: "roll", image: "/food-roll.png",
  },
  {
    id: "r8", name: "فطيرة مكس جبن رول", description: "جبن شيدر، جبن موزريلا، جبن رومي، جبن كيري، طماطم، فلفل، زيتون",
    price: 12, priceLarge: 18, calories: 300, caloriesLarge: 390,
    category: "roll", image: "/food-roll.png",
  },
  {
    id: "r9", name: "فطيرة فرانكفورتر رول", description: "فرانكفورتر، جبن موزريلا، جبن رومي، طماطم، فلفل، زيتون",
    price: 12, priceLarge: 18, calories: 290, caloriesLarge: 380,
    category: "roll", image: "/food-roll.png",
  },
  {
    id: "r10", name: "فطيرة سجق بسطرمة رول", description: "سجق بلدي، بسطرمة، جبن موزريلا، جبن رومي، طماطم، فلفل، زيتون",
    price: 15, priceLarge: 25, calories: 360, caloriesLarge: 470,
    category: "roll", image: "/food-roll.png",
  },
  {
    id: "r11", name: "فطيرة سجق بسطرمة كيري رول", description: "سجق بلدي، بسطرمة، جبن موزريلا، جبن رومي، جبن كيري، طماطم، فلفل، زيتون",
    price: 16, priceLarge: 26, calories: 360, caloriesLarge: 470,
    category: "roll", image: "/food-roll.png",
  },
  {
    id: "r12", name: "فطيرة لحم مفروم رول", description: "لحم مفروم، بصل مكرمل، جبن موزريلا، جبن رومي، طماطم، فلفل، زيتون",
    price: 12, priceLarge: 22, calories: 340, caloriesLarge: 450,
    category: "roll", image: "/food-roll.png",
  },
];

// ─── الكريب (8 items) ───
const crepeItems: MenuItem[] = [
  {
    id: "cr1", name: "كريب مكس لحوم", description: "لحم مفروم، سجق بلدي، فرانكفورتر، جبن موزريلا، فلفل، زيتون",
    price: 22, calories: 350, category: "crepes", image: "/food-crepe.png", isHot: true,
  },
  {
    id: "cr2", name: "كريب دجاج رانش", description: "دجاج فاهيتا، جبن موزريلا، فلفل، زيتون. يقدم مع صوص رانش",
    price: 20, calories: 330, category: "crepes", image: "/food-crepe.png", isHot: true,
  },
  {
    id: "cr3", name: "كريب سجق", description: "سجق بلدي، جبن موزريلا، فلفل، زيتون",
    price: 22, calories: 420, category: "crepes", image: "/food-crepe.png",
  },
  {
    id: "cr4", name: "كريب كوردن بلو", description: "شرايح لحمة مدخنة، دجاج فاهيتا، جبن موزريلا، فلفل، زيتون",
    price: 26, calories: 190, category: "crepes", image: "/food-crepe.png",
  },
  {
    id: "cr5", name: "كريب زنجر حار", description: "شرائح صدور الدجاج المقلي الحار، جبن موزريلا، شيبس حار",
    price: 22, calories: 180, category: "crepes", image: "/food-crepe.png",
  },
  {
    id: "cr6", name: "كريب استربس", description: "شرائح صدور الدجاج المقلي، جبن موزريلا، شيبس بارد",
    price: 22, calories: 180, category: "crepes", image: "/food-crepe.png",
  },
  {
    id: "cr7", name: "كريب فرانكفورتر", description: "فرانكفورتر، جبن موزريلا، فلفل، زيتون",
    price: 21, calories: 180, category: "crepes", image: "/food-crepe.png",
  },
  {
    id: "cr8", name: "كريب مكس جبن", description: "جبن شيدر، جبن موزريلا، جبن رومي، جبن كيري، فلفل، زيتون",
    price: 20, calories: 370, category: "crepes", image: "/food-crepe.png",
  },
];

// ─── الفطير الحلو (11 items) ───
const sweetItems: MenuItem[] = [
  {
    id: "sw1", name: "فطيرة بغاشة", description: "عجينة المشلتت، سكر بودرة، حليب",
    price: 17, priceLarge: 22, calories: 220, caloriesLarge: 280,
    category: "sweet", image: "/food-helw.png",
  },
  {
    id: "sw2", name: "فطيرة كاستر", description: "عجينة المشلتت، سكر بودرة، حليب كاستر",
    price: 20, priceLarge: 26, calories: 430, caloriesLarge: 560,
    category: "sweet", image: "/food-helw.png",
  },
  {
    id: "sw3", name: "فطيرة قشطة وعسل", description: "عجينة المشلتت، كاستر، قشطة، عسل، زبيب، جوز هند",
    price: 23, priceLarge: 30, calories: 430, caloriesLarge: 560,
    category: "sweet", image: "/food-helw.png", isHot: true,
  },
  {
    id: "sw4", name: "فطيرة نوتيلا", description: "عجينة المشلتت، نوتيلا، كاستر",
    price: 24, priceLarge: 31, calories: 360, caloriesLarge: 460,
    category: "sweet", image: "/food-helw.png",
  },
  {
    id: "sw5", name: "فطيرة نوتيلا مارشميلو", description: "عجينة المشلتت، نوتيلا، كاستر، مارشميلو",
    price: 27, priceLarge: 35, calories: 460, caloriesLarge: 600,
    category: "sweet", image: "/food-helw.png",
  },
  {
    id: "sw6", name: "فطيرة لوتس", description: "عجينة المشلتت، لوتس، كاستر",
    price: 24, priceLarge: 31, calories: 330, caloriesLarge: 430,
    category: "sweet", image: "/food-helw.png",
  },
  {
    id: "sw7", name: "فطيرة لوتس نوتيلا", description: "عجينة المشلتت، لوتس، نوتيلا، كاستر",
    price: 24, priceLarge: 31, calories: 310, caloriesLarge: 400,
    category: "sweet", image: "/food-helw.png",
  },
  {
    id: "sw8", name: "فطيرة لوتس نوتيلا مارشميلو", description: "عجينة المشلتت، لوتس، نوتيلا، كاستر، مارشميلو",
    price: 27, priceLarge: 35, calories: 510, caloriesLarge: 660,
    category: "sweet", image: "/food-helw.png",
  },
  {
    id: "sw9", name: "فطيرة كابتشينو", description: "عجينة المشلتت، كابتشينو، كاستر",
    price: 25, priceLarge: 32, calories: 660, caloriesLarge: 880,
    category: "sweet", image: "/food-helw.png",
  },
  {
    id: "sw10", name: "فطيرة بستاشيو", description: "عجينة المشلتت، بستاشيو، كاستر",
    price: 25, priceLarge: 32, calories: 430, caloriesLarge: 560,
    category: "sweet", image: "/food-pistachio.png",
  },
  {
    id: "sw11", name: "فطيرة بسبوسة", description: "عجينة المشلتت، بسبوسة، كاستر، قشطة، عسل، زبيب، جوز هند",
    price: 25, priceLarge: 32, calories: 430, caloriesLarge: 560,
    category: "sweet", image: "/food-helw.png",
  },
];

// ─── الحواوشي (2 items) ───
const hawawshiItems: MenuItem[] = [
  {
    id: "hw1", name: "حواوشي لحم", description: "لحم مفروم، موزريلا، بصل، فلفل رومي",
    price: 19, calories: 350, category: "hawawshi", image: "/food-hawawshi.png",
  },
  {
    id: "hw2", name: "حواوشي دجاج", description: "دجاج مفروم، موزريلا، بصل، فلفل رومي",
    price: 18, calories: 330, category: "hawawshi", image: "/food-hawawshi.png",
  },
];

// ─── كمبير (2 items) ───
const potatoItems: MenuItem[] = [
  {
    id: "pt1", name: "مشوية تقليدية", description: "بطاطس مشوية، زبدة، موزريلا",
    price: 10, calories: 130, category: "potato", image: "/food-potato.png",
  },
  {
    id: "pt2", name: "مشوية فرانكفورتر", description: "بطاطس مشوية، زبدة، موزريلا، فرانكفورتر",
    price: 14, calories: 150, category: "potato", image: "/food-potato.png",
  },
];

// ─── إضافات (9 items) ───
const extrasItems: MenuItem[] = [
  { id: "e1", name: "موزريلا", description: "إضافة جبن موزريلا إضافية", price: 8, calories: 150, category: "extras", image: "/food-extras.png" },
  { id: "e2", name: "دجاج", description: "إضافة دجاج", price: 8, calories: 110, category: "extras", image: "/food-extras.png" },
  { id: "e3", name: "سجق", description: "إضافة سجق", price: 7, calories: 140, category: "extras", image: "/food-extras.png" },
  { id: "e4", name: "بسطرمة", description: "إضافة بسطرمة", price: 10, calories: 130, category: "extras", image: "/food-extras.png" },
  { id: "e5", name: "سوسيس", description: "إضافة سوسيس", price: 7, calories: 120, category: "extras", image: "/food-extras.png" },
  { id: "e6", name: "مخلل", description: "إضافة مخلل", price: 2, calories: 50, category: "extras", image: "/food-extras.png" },
  { id: "e7", name: "رانش", description: "صوص رانش إضافي", price: 2, calories: 40, category: "extras", image: "/food-extras.png" },
  { id: "e8", name: "باربكيو", description: "صوص باربكيو إضافي", price: 2, calories: 60, category: "extras", image: "/food-extras.png" },
  { id: "e9", name: "هالبينو", description: "فلفل هالبينو إضافي", price: 2, calories: 40, category: "extras", image: "/food-extras.png" },
];

// ─── مشروبات (4 items) ───
const drinksItems: MenuItem[] = [
  { id: "d1", name: "بيبسي", description: "", price: 3, calories: 86, category: "drinks", image: "/drink-pepsi.png" },
  { id: "d2", name: "كينزا", description: "", price: 2, calories: 111, category: "drinks", image: "/drink-kinza.png" },
  { id: "d3", name: "شاي", description: "", price: 2, calories: 5, category: "drinks", image: "/drink-tea.png" },
  { id: "d4", name: "ماء", description: "", price: 0.5, calories: 0, category: "drinks", image: "/food-mushaltat.png" },
];

// ─── Categories assembly ───
export const categories: MenuCategory[] = [
  { key: "mushaltat", label: "فطير مشلتت", labelEn: "Mushaltat Pies", image: "/food-mushaltat.png", items: mushaltatItems },
  { key: "savory", label: "الفطير الحادق", labelEn: "Savory Pies", image: "/food-savory.png", items: savoryItems },
  { key: "pizzaface", label: "فطير وش بيتزا", labelEn: "Pizza-Faced Pies", image: "/food-pizza.png", items: pizzaFaceItems },
  { key: "pizza", label: "البيتزا", labelEn: "Pizza", image: "/food-pizza.png", items: pizzaItems },
  { key: "pizzabur", label: "بيتزا بُر", labelEn: "Bur Pizza", image: "/food-pizza.png", items: pizzaBurItems },
  { key: "roll", label: "فطيرة رول", labelEn: "Roll Pies", image: "/food-roll.png", items: rollItems },
  { key: "crepes", label: "الكريب", labelEn: "Crepes", image: "/food-crepe.png", items: crepeItems },
  { key: "sweet", label: "الفطير الحلو", labelEn: "Sweet Pies", image: "/food-helw.png", items: sweetItems },
  { key: "hawawshi", label: "الحواوشي", labelEn: "Hawawshi", image: "/food-hawawshi.png", items: hawawshiItems },
  { key: "potato", label: "كمبير", labelEn: "Potato", image: "/food-potato.png", items: potatoItems },
  { key: "extras", label: "إضافات", labelEn: "Extras", image: "/food-extras.png", items: extrasItems },
  { key: "drinks", label: "مشروبات", labelEn: "Drinks", image: "/food-extras.png", items: drinksItems },
];

export const allItems: MenuItem[] = categories.flatMap((c) => c.items);

export const hotItemIds = new Set([
  "m1", "s1", "s2", "s5", "pf1", "pz1", "sw3", "cr1", "cr2",
]);
