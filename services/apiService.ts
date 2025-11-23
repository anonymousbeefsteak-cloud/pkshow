import { LS_KEYS, MENU_DATA, ADDONS, SAUCE_CHOICES, DESSERT_CHOICES_A, DESSERT_CHOICES_B, PASTA_CHOICES_A, PASTA_CHOICES_B, COLD_NOODLE_CHOICES, SIMPLE_MEAL_CHOICES, MENU_DATA_EN, ADDONS_EN, SAUCE_CHOICES_EN, DESSERT_CHOICES_A_EN, DESSERT_CHOICES_B_EN, PASTA_CHOICES_A_EN, PASTA_CHOICES_B_EN, COLD_NOODLE_CHOICES_EN, SIMPLE_MEAL_CHOICES_EN } from '../constants';
import { MenuItem, MenuCategory, OptionsData, Order, SalesStats, DailySalesData, MonthlySalesData } from '../types';

const getFromLS = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const saveToLS = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
};

export const initializeLocalStorage = () => {
  if (!localStorage.getItem(LS_KEYS.MENU)) saveToLS(LS_KEYS.MENU, MENU_DATA);
  if (!localStorage.getItem(LS_KEYS.ADDONS)) saveToLS(LS_KEYS.ADDONS, ADDONS);
  if (!localStorage.getItem(LS_KEYS.ORDERS)) saveToLS(LS_KEYS.ORDERS, []);
  if (!localStorage.getItem(LS_KEYS.SETTINGS)) saveToLS(LS_KEYS.SETTINGS, { isQuietHours: false });
};

export const apiService = {
  async getMenuAndAddons(language = 'zh') {
    const storedMenu = getFromLS<MenuCategory[]>(LS_KEYS.MENU, []);
    const storedAddons = getFromLS<MenuItem[]>(LS_KEYS.ADDONS, []);
    const storedOptions = getFromLS<OptionsData>(LS_KEYS.OPTIONS, { sauces: [], dessertsA: [], dessertsB: [], pastasA: [], pastasB: [], coldNoodles: [], simpleMeals: [] });
    const settings = getFromLS<{ isQuietHours: boolean }>(LS_KEYS.SETTINGS, { isQuietHours: false });

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

    let mergedMenu = storedMenu.length > 0 ? storedMenu : staticMenu;

    mergedMenu = mergedMenu.map(cat => {
        let displayTitle = cat.title;
        if (language === 'en') {
             const enCat = MENU_DATA_EN.find(c => c.items[0]?.id === cat.items[0]?.id);
             if (enCat) displayTitle = enCat.title;
        }

        return {
            ...cat,
            title: displayTitle,
            items: cat.items.map(item => {
                const staticItem = staticMenu.flatMap(c => c.items).find(i => i.id === item.id);
                if (staticItem) {
                    return {
                        ...item, 
                        weight: staticItem.weight, 
                        customizations: staticItem.customizations,
                        name: language === 'en' ? staticItem.name : item.name, 
                        description: language === 'en' ? staticItem.description : item.description,
                        itemShortName: staticItem.itemShortName,
                        printShortName: staticItem.printShortName,
                        image: item.image || staticItem.image
                    };
                }
                return item;
            })
        };
    });

    let mergedAddons = storedAddons.length > 0 ? storedAddons : staticAddons;
    mergedAddons = mergedAddons.map(addon => {
        const staticAddon = staticAddons.find(a => a.id === addon.id);
        if (staticAddon) {
            return {
                ...addon,
                name: language === 'en' ? staticAddon.name : addon.name,
                printName: staticAddon.printName
            };
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

    const mergedOptions = {
        sauces: mergeOptionGroup(staticOptions.sauces, storedOptions.sauces),
        dessertsA: mergeOptionGroup(staticOptions.dessertsA, storedOptions.dessertsA),
        dessertsB: mergeOptionGroup(staticOptions.dessertsB, storedOptions.dessertsB),
        pastasA: mergeOptionGroup(staticOptions.pastasA, storedOptions.pastasA),
        pastasB: mergeOptionGroup(staticOptions.pastasB, storedOptions.pastasB),
        coldNoodles: mergeOptionGroup(staticOptions.coldNoodles, storedOptions.coldNoodles),
        simpleMeals: mergeOptionGroup(staticOptions.simpleMeals, storedOptions.simpleMeals),
    };

    return Promise.resolve({ menu: mergedMenu, addons: mergedAddons, options: mergedOptions, isQuietHours: settings.isQuietHours });
  },

  async submitOrder(orderData: Partial<Order>) {
    try {
      const allOrders = getFromLS<Order[]>(LS_KEYS.ORDERS, []);
      const newId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const now = new Date().toISOString();
      const newOrder: Order = { 
          id: newId, 
          createdAt: now, 
          status: '待店長確認', 
          items: orderData.items || [],
          totalPrice: orderData.totalPrice || 0,
          guestCount: orderData.guestCount || 1,
          customerInfo: orderData.customerInfo || { name: '', phone: '', tableNumber: '' },
          orderType: orderData.orderType || '外帶'
      };
      allOrders.push(newOrder);
      saveToLS(LS_KEYS.ORDERS, allOrders);
      const recentOrders = getFromLS<string[]>(LS_KEYS.RECENT_ORDERS, []);
      recentOrders.unshift(newOrder.id);
      saveToLS(LS_KEYS.RECENT_ORDERS, recentOrders.slice(0, 5));
      return Promise.resolve({ success: true, orderId: newId, order: newOrder });
    } catch (error) {
        console.error("Failed to submit order:", error);
        throw new Error('Order submission failed');
    }
  },

  async getOrder(orderId: string) {
    const allOrders = getFromLS<Order[]>(LS_KEYS.ORDERS, []);
    const order = allOrders.find(o => o.id === orderId);
    if (order) return Promise.resolve({ success: true, order });
    return Promise.resolve({ success:false, message: `找不到訂單 ${orderId}` });
  },

  async searchOrders(params: { name?: string; phone?: string; startDate?: string; endDate?: string }) {
    let allOrders = getFromLS<Order[]>(LS_KEYS.ORDERS, []);
    if (params.name) allOrders = allOrders.filter(o => o.customerInfo.name === params.name);
    if (params.phone) allOrders = allOrders.filter(o => o.customerInfo.phone === params.phone);
    if (params.startDate && params.endDate) {
        const startDate = new Date(params.startDate); startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(params.endDate); endDate.setHours(23, 59, 59, 999);
        allOrders = allOrders.filter(o => { const orderDate = new Date(o.createdAt); return orderDate >= startDate && orderDate <= endDate; });
    }
    const summaries = allOrders.map(o => ({ id: o.id, customerName: o.customerInfo.name, totalAmount: o.totalPrice, timestamp: o.createdAt, })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return Promise.resolve({ success: true, orders: summaries });
  },
  
  async getAllOrders() {
      const allOrders = getFromLS<Order[]>(LS_KEYS.ORDERS, []);
      return Promise.resolve(allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  },

  async updateOrderStatus(orderId: string, status: Order['status']) {
      const allOrders = getFromLS<Order[]>(LS_KEYS.ORDERS, []);
      const index = allOrders.findIndex(o => o.id === orderId);
      if (index !== -1) {
          allOrders[index].status = status;
          saveToLS(LS_KEYS.ORDERS, allOrders);
          return Promise.resolve(true);
      }
      return Promise.resolve(false);
  },

  async saveMenuConfig(menu: MenuCategory[], addons: MenuItem[], options: OptionsData) {
      saveToLS(LS_KEYS.MENU, menu);
      saveToLS(LS_KEYS.ADDONS, addons);
      saveToLS(LS_KEYS.OPTIONS, options);
      return Promise.resolve(true);
  },

  async updateQuietHours(isQuiet: boolean) {
      saveToLS(LS_KEYS.SETTINGS, { isQuietHours: isQuiet });
      return Promise.resolve(true);
  },
  
  async clearAllData() {
      if(window.confirm('確定要清除所有訂單資料嗎？(菜單設定保留)')) {
          saveToLS(LS_KEYS.ORDERS, []);
          localStorage.removeItem(LS_KEYS.RECENT_ORDERS);
          return Promise.resolve(true);
      }
      return Promise.resolve(false);
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
      const link = document.createElement('a'); 
      link.href = url; 
      link.download = `steakhouse_backup_${new Date().toISOString().split('T')[0]}.json`; 
      link.click(); 
      URL.revokeObjectURL(url);
  },

  async restoreData(file: File) {
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
      const salesTrend = Array.from(trendMap.entries()).map(([date, revenue]) => ({ date, revenue })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-7); 
      const itemCounts = new Map<string, { count: number; revenue: number }>();
      completedOrders.forEach(o => {
          o.items.forEach(item => {
              const name = item.item.name;
              const current = itemCounts.get(name) || { count: 0, revenue: 0 };
              itemCounts.set(name, { count: current.count + item.quantity, revenue: current.revenue + item.totalPrice });
          });
      });
      const popularItems = Array.from(itemCounts.entries()).map(([name, data]) => ({ name, quantity: data.count, revenue: data.revenue })).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
      return Promise.resolve({ totalRevenue, orderCount: completedOrders.length, popularItems, salesTrend });
  },
  
  async getDailySales(dateStr: string): Promise<DailySalesData> { // YYYY-MM-DD
    const allOrders = getFromLS<Order[]>(LS_KEYS.ORDERS, []);
    const dailyOrders = allOrders.filter(o => {
        if (o.status === '錯誤') return false;
        const orderDate = new Date(o.createdAt);
        const localYMD = orderDate.getFullYear() + '-' + String(orderDate.getMonth()+1).padStart(2,'0') + '-' + String(orderDate.getDate()).padStart(2,'0');
        return localYMD === dateStr;
    });
    const totalRevenue = dailyOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const itemsMap = new Map<string, {name:string, quantity: number, total: number}>();
    dailyOrders.forEach(o => {
        o.items.forEach(i => {
           const key = i.item.name;
           const curr = itemsMap.get(key) || { name: key, quantity: 0, total: 0 };
           itemsMap.set(key, { name: key, quantity: curr.quantity + i.quantity, total: curr.total + i.totalPrice }); 
        });
    });
    const breakdown = Array.from(itemsMap.values()).sort((a,b) => b.total - a.total);
    return Promise.resolve({ totalRevenue, orderCount: dailyOrders.length, avgOrderValue: dailyOrders.length ? Math.round(totalRevenue / dailyOrders.length) : 0, breakdown });
  },

  async getMonthlySales(monthStr: string): Promise<MonthlySalesData> { // YYYY-MM
     const allOrders = getFromLS<Order[]>(LS_KEYS.ORDERS, []);
     const monthlyOrders = allOrders.filter(o => {
         if(o.status === '錯誤') return false;
         const orderDate = new Date(o.createdAt);
         const localYM = orderDate.getFullYear() + '-' + String(orderDate.getMonth()+1).padStart(2,'0');
         return localYM === monthStr;
     });
     const totalRevenue = monthlyOrders.reduce((sum, o) => sum + o.totalPrice, 0);
     const daysMap = new Map<number, number>();
     monthlyOrders.forEach(o => {
         const day = new Date(o.createdAt).getDate();
         daysMap.set(day, (daysMap.get(day) || 0) + o.totalPrice);
     });
     const dailyTrend = [];
     const [year, month] = monthStr.split('-').map(Number);
     const daysInMonth = new Date(year, month, 0).getDate();
     for(let i=1; i<=daysInMonth; i++) {
         dailyTrend.push({ day: i, revenue: daysMap.get(i) || 0 });
     }
     return Promise.resolve({ totalRevenue, dailyTrend });
  }
};