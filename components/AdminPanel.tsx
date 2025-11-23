import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Dashboard } from './admin/Dashboard';
import { OrderManager } from './admin/OrderManager';
import { MenuManager } from './admin/MenuManager';
import { Settings } from './admin/Settings';
import { HomeIcon, ClipboardListIcon, MenuIcon, CogIcon, RefreshIcon } from './Icons';
import { Order, MenuCategory, Addon, OptionsData, SalesStats } from '../types';

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'menu' | 'settings'>('dashboard');
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [options, setOptions] = useState<OptionsData>({ sauces: [], dessertsA: [], dessertsB: [], pastasA: [], pastasB: [], coldNoodles: [], simpleMeals: [] });
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [isQuietHours, setIsQuietHours] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
        const { menu: m, addons: a, options: o, isQuietHours: q } = await apiService.getMenuAndAddons();
        const allOrders = await apiService.getAllOrders();
        const statistics = await apiService.getSalesStatistics();
        setMenu(m); setAddons(a); setOptions(o); setIsQuietHours(q); setOrders(allOrders); setStats(statistics);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); const interval = setInterval(fetchData, 15000); return () => clearInterval(interval); }, []);
  
  const handleStatusUpdate = async (id: string, status: string) => { await apiService.updateOrderStatus(id, status); fetchData(); };
  const handleSaveMenu = async (m: MenuCategory[], a: Addon[], o: OptionsData) => { await apiService.saveMenuConfig(m, a, o); fetchData(); };
  const handleToggleQuiet = async (val: boolean) => { await apiService.updateQuietHours(val); fetchData(); };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-50 transition-all duration-300 hidden md:flex">
        <div className="p-6 border-b border-slate-800"><h1 className="text-2xl font-bold text-white">無名牛排 <span className="text-xs text-indigo-400 block mt-1">管理後台</span></h1></div>
        <nav className="flex-1 py-6 space-y-1">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-colors ${activeTab === 'dashboard' ? 'bg-slate-800 text-white border-r-4 border-indigo-500' : ''}`}><HomeIcon /> 總覽看板</button>
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-colors ${activeTab === 'orders' ? 'bg-slate-800 text-white border-r-4 border-indigo-500' : ''}`}><ClipboardListIcon /> 訂單管理 {orders.filter(o => o.status === '待處理' || o.status === '待店長確認').length > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{orders.filter(o => o.status === '待處理' || o.status === '待店長確認').length}</span>}</button>
            <button onClick={() => setActiveTab('menu')} className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-colors ${activeTab === 'menu' ? 'bg-slate-800 text-white border-r-4 border-indigo-500' : ''}`}><MenuIcon /> 菜單管理</button>
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-colors ${activeTab === 'settings' ? 'bg-slate-800 text-white border-r-4 border-indigo-500' : ''}`}><CogIcon /> 系統設定</button>
        </nav>
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center"><button onClick={onBack} className="hover:text-white underline flex items-center justify-center w-full gap-2">← 返回點餐前台</button></div>
      </aside>
      <div className="md:hidden fixed w-full bg-slate-900 text-white z-50 p-4 flex justify-between items-center"><span className="font-bold">管理後台</span><div className="flex gap-3"><button onClick={() => setActiveTab('dashboard')} className={`text-sm ${activeTab === 'dashboard' ? 'text-indigo-400' : ''}`}>總覽</button><button onClick={() => setActiveTab('orders')} className={`text-sm ${activeTab === 'orders' ? 'text-indigo-400' : ''}`}>訂單</button><button onClick={() => setActiveTab('menu')} className={`text-sm ${activeTab === 'menu' ? 'text-indigo-400' : ''}`}>菜單</button><button onClick={onBack} className="text-sm text-slate-400">離開</button></div></div>
      <main className="flex-1 md:ml-64 p-4 md:p-8 mt-14 md:mt-0 overflow-x-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"><h2 className="text-2xl font-bold text-slate-800">{activeTab === 'dashboard' && '營運總覽'}{activeTab === 'orders' && '即時訂單'}{activeTab === 'menu' && '菜單品項管理'}{activeTab === 'settings' && '系統設定'}</h2><div className="flex gap-3"><button onClick={() => fetchData()} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 text-slate-700 transition-all active:scale-95"><RefreshIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> <span className="hidden md:inline">重整數據</span></button></div></header>
        <div className="animate-fade-in pb-10">{activeTab === 'dashboard' && <Dashboard stats={stats} orders={orders} />}{activeTab === 'orders' && <OrderManager orders={orders} onStatusUpdate={handleStatusUpdate} />}{activeTab === 'menu' && <MenuManager menu={menu} addons={addons} options={options} onSave={handleSaveMenu} />}{activeTab === 'settings' && <Settings isQuietHours={isQuietHours} onToggleQuiet={handleToggleQuiet} onBackup={apiService.backupData} onRestore={apiService.restoreData} onClear={apiService.clearAllData} />}</div>
      </main>
    </div>
  );
};