export interface MenuItem {
  id: string;
  name: string;
  itemShortName?: string;
  printShortName?: string;
  printName?: string; // For addons
  weight?: string;
  price: number;
  description?: string;
  image?: string;
  category?: string;
  isAvailable: boolean;
  customizations?: ItemCustomizations;
  isAddon?: boolean;
}

export interface ItemCustomizations {
  doneness?: boolean;
  sauceChoice?: boolean;
  drinkChoice?: boolean;
  notes?: boolean;
  saucesPerItem?: number;
  componentChoice?: {
    title: string;
    options: string[];
  };
  multiChoice?: {
    title: string;
    options: string[];
  };
  sideChoice?: {
    title: string;
    options: string[];
    choices: number;
  };
  dessertChoice?: boolean;
  pastaChoice?: boolean;
  singleChoiceAddon?: {
      price: number;
  };
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}

export interface OptionItem {
  name: string;
  isAvailable: boolean;
}

export interface OptionsData {
  sauces: OptionItem[];
  dessertsA: OptionItem[];
  dessertsB: OptionItem[];
  pastasA: OptionItem[];
  pastasB: OptionItem[];
  coldNoodles: OptionItem[];
  simpleMeals: OptionItem[];
  [key: string]: OptionItem[];
}

export interface CartItem {
  cartId: string;
  cartKey: string;
  item: MenuItem;
  quantity: number;
  categoryTitle?: string;
  totalPrice: number;
  selectedDonenesses?: Record<string, number>;
  selectedDrinks?: Record<string, number>;
  selectedSauces?: { name: string; quantity: number }[];
  selectedDesserts?: { name: string; quantity: number }[];
  selectedPastas?: { name: string; quantity: number }[];
  selectedAddons?: { id: string; name: string; price: number; quantity: number; printName?: string }[];
  selectedComponent?: Record<string, number>;
  selectedSideChoices?: Record<string, number>;
  selectedMultiChoice?: Record<string, number>;
  selectedSingleChoiceAddon?: any;
  selectedNotes?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: '待店長確認' | '待處理' | '製作中' | '可以取餐' | '已完成' | '錯誤';
  items: CartItem[];
  totalPrice: number;
  guestCount: number;
  customerInfo: {
    name: string;
    phone: string;
    tableNumber: string;
  };
  orderType: string;
}

export interface SalesStats {
  totalRevenue: number;
  orderCount: number;
  popularItems: { name: string; quantity: number; revenue: number }[];
  salesTrend: { date: string; revenue: number }[];
}

export interface DailySalesData {
    totalRevenue: number;
    orderCount: number;
    avgOrderValue: number;
    breakdown: { name: string; quantity: number; total: number }[];
}

export interface MonthlySalesData {
    totalRevenue: number;
    dailyTrend: { day: number; revenue: number }[];
}
