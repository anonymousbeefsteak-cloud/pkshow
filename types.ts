
export interface MenuItem {
    id: string;
    name: string;
    itemShortName?: string;
    printShortName?: string;
    weight?: string;
    price: number;
    description?: string;
    customizations: Customizations;
    isAvailable: boolean;
    image?: string;
}

export interface Customizations {
    doneness?: boolean;
    sauceChoice?: boolean;
    drinkChoice?: boolean;
    dessertChoice?: boolean;
    pastaChoice?: boolean;
    notes?: boolean;
    saucesPerItem?: number;
    componentChoice?: { title: string; options: string[] };
    multiChoice?: { title: string; options: string[] };
    sideChoice?: { title: string; options: string[]; choices: number };
    singleChoiceAddon?: { name: string; price: number };
}

export interface Addon {
    id: string;
    name: string;
    printName?: string;
    price: number;
    category: string;
    isAvailable: boolean;
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
}

export interface MenuCategory {
    title: string;
    items: MenuItem[];
}

export interface CartItem {
    cartId: string;
    cartKey: string;
    item: MenuItem;
    quantity: number;
    categoryTitle: string;
    totalPrice: number;
    selectedDonenesses?: Record<string, number>;
    selectedDrinks?: Record<string, number>;
    selectedSauces?: { name: string; quantity: number }[];
    selectedDesserts?: { name: string; quantity: number }[];
    selectedPastas?: { name: string; quantity: number }[];
    selectedComponent?: Record<string, number>;
    selectedSideChoices?: Record<string, number>;
    selectedMultiChoice?: Record<string, number>;
    selectedSingleChoiceAddon?: { name: string; price: number };
    selectedNotes?: string;
    selectedAddons?: { id: string; name: string; price: number; quantity: number }[];
}

export interface Order {
    id: string;
    createdAt: string;
    status: string;
    items: CartItem[];
    totalPrice: number;
    guestCount?: number;
    customerInfo: {
        name: string;
        phone: string;
        tableNumber?: string;
    };
    orderType: string;
}

export interface SalesStats {
    totalRevenue: number;
    orderCount: number;
    popularItems: { name: string; quantity: number; revenue: number }[];
    salesTrend: { date: string; revenue: number }[];
}

export interface SearchOrderParams {
    name?: string;
    phone?: string;
    startDate?: string;
    endDate?: string;
}

export interface OrderSummary {
    id: string;
    customerName: string;
    totalPrice: number;
    createdAt: string;
}