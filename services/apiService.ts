
import { MenuItem, Addon, OptionsData, Order, MenuCategory, SalesStats, SearchOrderParams, OrderSummary } from '../types';
import { 
    MENU_DATA, ADDONS, DONENESS_LEVELS, SAUCE_CHOICES, DRINK_CHOICES, DESSERT_CHOICES_A, 
    DESSERT_CHOICES_B, PASTA_CHOICES_A, PASTA_CHOICES_B, COLD_NOODLE_CHOICES, SIMPLE_MEAL_CHOICES,
    MENU_DATA_EN, ADDONS_EN, SAUCE_CHOICES_EN, DESSERT_CHOICES_A_EN, DESSERT_CHOICES_B_EN,
    PASTA_CHOICES_A_EN, PASTA_CHOICES_B_EN, COLD_NOODLE_CHOICES_EN, SIMPLE_MEAL_CHOICES_EN
} from '../constants';

const LS_KEYS = {
  MENU: 'steakhouse_menu',
  ADDONS: 'steakhouse_addons',
  OPTIONS: 'steakhouse_options',
  ORDERS: 'steakhouse_orders',
  SETTINGS: 'steakhouse_settings',
};

const getFromLS = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

const saveToLS = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key “${key}”:`, error);
  }
};

// Initialize
if (!localStorage.getItem(LS_KEYS.MENU)) saveToLS(LS_KEYS.MENU, MENU_DATA);
if (!localStorage.getItem(LS_KEYS.ADDONS)) saveToLS(LS_KEYS.ADDONS, ADDONS);
if (!localStorage.getItem(LS_KEYS.ORDERS)) saveToLS(LS_KEYS.ORDERS, []);
if (!localStorage.getItem(LS_KEYS.SETTINGS)) saveToLS(LS_KEYS.SETTINGS, { isQuietHours: false });

export const apiService = {
  async getMenuAndAddons(language: 'zh' | 'en' = 'zh'): Promise<{ menu: MenuCategory[]; addons: Addon[]; options: OptionsData; isQuietHours: boolean }> {
    const storedMenu = getFromLS<MenuCategory[]>(LS_KEYS.MENU, []);
    const storedAddons = getFromLS<Addon[]>(LS_KEYS.ADDONS, []);
    const storedOptions = getFromLS<OptionsData>(LS_KEYS.OPTIONS, { sauces: [], dessertsA: [], dessertsB: [], pastasA: [], pastasB: [], coldNoodles: [], simpleMeals: [] });
    const settings = getFromLS(LS_KEYS.SETTINGS, { isQuietHours: false });

    const staticMenu = language === 'zh' ? MENU_DATA : MENU_DATA_EN;
    const staticAddons = language === 'zh' ? ADDONS : ADDONS_EN;
    
    const staticOptions = {
        sauces: language === 'zh' ? SAUCE_CHOICES : SAUCE_CHOICES_EN,
        dessertsA: language === 'zh' ? DESSERT_CHOICES_A : DESSERT_CHOICES_A_EN,
        dessertsB: language === 'zh' ? DESSERT_CHOICES_B : DESSERT_CHOICES_B_EN,
        pastasA: language === 'zh' ? PASTA_CHOICES_A : PASTA_CHOICES_A_EN,
        pastasB: language === 'zh' ? PASTA_CHOICES_B : PASTA_CHOICES_B_EN,
        coldNoodles: language === 'zh' ? COLD_NOODLE_CHOICES : COLD_NOODLE_CHOICES_EN,
        simpleMeals: language === 'zh' ? SIMPLE_MEAL_CHOICES : SIMPLE_MEAL_CHOICES_EN,
    };

    const mergedMenu = staticMenu.map(category => {
        const storedCategory = storedMenu.find(c => c.items.some(i => category.items.some(ci => ci.id === i.id))) || storedMenu.find(c => c.title === category.title);
        return {
            ...category,
            items: category.items.map(item => {
                const storedItem = storedCategory?.items.find(i => i.id === item.id);
                if (storedItem) {
                    return { ...item, price: storedItem.price, isAvailable: storedItem.isAvailable };
                }
                return item;
            })
        };
    });

    const mergedAddons = staticAddons.map(addon => {
        const storedAddon = storedAddons.find(a => a.id === addon.id);
        if (storedAddon) {
            return { ...addon, price: storedAddon.price, isAvailable: storedAddon.isAvailable };
        }
        return addon;
    });

    const mergeOptionGroup = (targetNames: string[], storedGroup: any[]) => {
        if (!storedGroup) return targetNames.map(name => ({ name, isAvailable: true }));
        return targetNames.map((name, index) => {
            const stored = storedGroup[index]; 
            return { name, isAvailable: stored ? stored.isAvailable : true };
        });
    };

    const mergedOptions: OptionsData = {
        sauces: mergeOptionGroup(staticOptions.sauces, storedOptions.sauces),
        dessertsA: mergeOptionGroup(staticOptions.dessertsA, storedOptions.dessertsA),
        dessertsB: mergeOptionGroup(staticOptions.dessertsB, storedOptions.dessertsB),
        pastasA: mergeOptionGroup(staticOptions.pastasA, storedOptions.pastasA),
        pastasB: mergeOptionGroup(staticOptions.pastasB, storedOptions.pastasB),
        coldNoodles: mergeOptionGroup(staticOptions.coldNoodles, storedOptions.coldNoodles),
        simpleMeals: mergeOptionGroup(staticOptions.simpleMeals, storedOptions.simpleMeals),
    };

    return { menu: mergedMenu, addons: mergedAddons, options: mergedOptions, isQuietHours: settings.isQuietHours };
  },

  async submitOrder(orderData: Partial<Order>): Promise<{ success: boolean; orderId?: string; order?: Order; message?: string }> {
    try {
      const allOrders = getFromLS<Order[]>(LS_KEYS.ORDERS, []);
      const newId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const now = new Date().toISOString();
      const newOrder: Order = { 
          id: newId, 
          createdAt: now, 
          status: '待店長確認',
          items: [],
          totalPrice: 0,
          customerInfo: { name: '', phone: '' },
          orderType: '外帶',
          ...orderData 
        } as Order;
      allOrders.push(newOrder);
      saveToLS(LS_KEYS.ORDERS, allOrders);
      
      // NOTE: Strict Privacy - We do NOT save to 'steakhouse-recent-orders' anymore.
      // The user must remember their Order ID or ask staff.
      
      return { success: true, orderId: newId, order: newOrder };
    } catch (error) {
        console.error("Failed to submit order:", error);
        return { success: false, message: 'Submission failed' };
    }
  },

  async getOrder(orderId: string): Promise<{ success: boolean; order?: Order; message?: string }> {
    const allOrders = getFromLS<Order[]>(LS_KEYS.ORDERS, []);
    const order = allOrders.find(o => o.id === orderId);
    if (order) return { success: true, order };
    return { success: false, message: `找不到訂單 ${orderId}` };
  },

  async searchOrders(params: SearchOrderParams): Promise<{ success: boolean; orders: OrderSummary[] }> {
    let allOrders = getFromLS<Order[]>(LS_KEYS.ORDERS, []);
    
    if (params.name) {
        const searchTerm = params.name.toLowerCase();
        allOrders = allOrders.filter(o => o.customerInfo.name.toLowerCase().includes(searchTerm));
    }
    
    if (params.phone) {
        allOrders = allOrders.filter(o => o.customerInfo.phone.includes(params.phone!));
    }
    
    if (params.startDate && params.endDate) {
        const startDate = new Date(params.startDate); 
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(params.endDate); 
        endDate.setHours(23, 59, 59, 999);
        
        allOrders = allOrders.filter(o => { 
            const orderDate = new Date(o.createdAt); 
            return orderDate >= startDate && orderDate <= endDate; 
        });
    }
    
    const summaries = allOrders.map(o => ({ 
        id: o.id, 
        customerName: o.customerInfo.name, 
        totalPrice: o.totalPrice, 
        createdAt: o.createdAt 
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return Promise.resolve({ success: true, orders: summaries });
  },
  
  async getAllOrders(): Promise<Order[]> {
      const allOrders = getFromLS<Order[]>(LS_KEYS.ORDERS, []);
      return allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
      const allOrders = getFromLS<Order[]>(LS_KEYS.ORDERS, []);
      const index = allOrders.findIndex(o => o.id === orderId);
      if (index !== -1) {
          allOrders[index].status = status;
          saveToLS(LS_KEYS.ORDERS, allOrders);
          return true;
      }
      return false;
  },

  async saveMenuConfig(menu: MenuCategory[], addons: Addon[], options: OptionsData): Promise<boolean> {
      saveToLS(LS_KEYS.MENU, menu);
      saveToLS(LS_KEYS.ADDONS, addons);
      saveToLS(LS_KEYS.OPTIONS, options);
      return true;
  },

  async updateQuietHours(isQuiet: boolean): Promise<boolean> {
      saveToLS(LS_KEYS.SETTINGS, { isQuietHours: isQuiet });
      return true;
  },
  
  async clearAllData(): Promise<boolean> {
      saveToLS(LS_KEYS.ORDERS, []);
      localStorage.removeItem('steakhouse-recent-orders');
      return true;
  },

  async backupData() {
      const data = { 
          menu: getFromLS(LS_KEYS.MENU, []), 
          addons: getFromLS(LS_KEYS.ADDONS, []), 
          orders: getFromLS(LS_KEYS.ORDERS, []), 
          settings: getFromLS(LS_KEYS.SETTINGS, {}), 
          options: getFromLS(LS_KEYS.OPTIONS, {}) 
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {type : 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); 
      a.href = url; 
      a.download = `steakhouse_backup_${new Date().toISOString().split('T')[0]}.json`; 
      a.click(); 
      URL.revokeObjectURL(url);
  },

  async restoreData(file: File): Promise<boolean> {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
              try {
                  const result = e.target?.result as string;
                  const data = JSON.parse(result);
                  if (data.menu) saveToLS(LS_KEYS.MENU, data.menu);
                  if (data.addons) saveToLS(LS_KEYS.ADDONS, data.addons);
                  if (data.orders) saveToLS(LS_KEYS.ORDERS, data.orders);
                  if (data.settings) saveToLS(LS_KEYS.SETTINGS, data.settings);
                  if (data.options) saveToLS(LS_KEYS.OPTIONS, data.options);
                  resolve(true);
              } catch (err) { reject(err); }
          };
          reader.readAsText(file);
      });
  },

  async getSalesStatistics(): Promise<SalesStats> {
      const allOrders = getFromLS<Order[]>(LS_KEYS.ORDERS, []);
      const completedOrders = allOrders.filter(o => o.status !== '錯誤'); 
      const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);
      const trendMap = new Map<string, number>();
      
      completedOrders.forEach(o => {
          const date = new Date(o.createdAt).toLocaleDateString('zh-TW');
          trendMap.set(date, (trendMap.get(date) || 0) + o.totalPrice);
      });
      
      const salesTrend = Array.from(trendMap.entries())
          .map(([date, revenue]) => ({ date, revenue }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(-7); 
          
      const itemCounts = new Map<string, { count: number; revenue: number }>();
      completedOrders.forEach(o => {
          o.items.forEach(item => {
              const name = item.item.name;
              const current = itemCounts.get(name) || { count: 0, revenue: 0 };
              itemCounts.set(name, { count: current.count + item.quantity, revenue: current.revenue + item.totalPrice });
          });
      });
      
      const popularItems = Array.from(itemCounts.entries())
          .map(([name, data]) => ({ name, quantity: data.count, revenue: data.revenue }))
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);
          
      return { totalRevenue, orderCount: completedOrders.length, popularItems, salesTrend };
  }
};
