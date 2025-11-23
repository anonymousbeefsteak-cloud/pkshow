import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Order, MenuItem, MenuCategory, SalesStats, OptionsData, DailySalesData, MonthlySalesData } from '../types';
import { apiService } from '../services/apiService';
import { HomeIcon, ClipboardListIcon, MenuIcon, ChartBarIcon, CogIcon, RefreshIcon, DownloadIcon, TrashIcon, PencilIcon, CalendarIcon, UploadIcon } from './Icons';

// Sub-components definitions
const Dashboard = ({ stats, orders }: { stats: SalesStats | null, orders: Order[] }) => {
    const today = new Date().toLocaleDateString('zh-TW');
    const todaysOrders = orders.filter(o => new Date(o.createdAt).toLocaleDateString('zh-TW') === today);
    const todaysRevenue = todaysOrders.reduce((sum, o) => sum + (o.status !== '錯誤' ? o.totalPrice : 0), 0);
    const pendingCount = orders.filter(o => o.status === '待店長確認' || o.status === '待處理').length;
    if (!stats) return <div className="p-8 text-center text-slate-500">載入統計數據中...</div>;
    return ( <div className="space-y-6"> <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-green-500"><h3 className="text-sm font-medium text-slate-500 uppercase">今日營業額</h3><p className="text-3xl font-bold text-slate-800 mt-2">${todaysRevenue.toLocaleString()}</p></div> <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500"><h3 className="text-sm font-medium text-slate-500 uppercase">今日訂單數</h3><p className="text-3xl font-bold text-slate-800 mt-2">{todaysOrders.length} <span className="text-sm text-slate-400 font-normal">筆</span></p></div> <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-red-500"><h3 className="text-sm font-medium text-slate-500 uppercase">待處理訂單</h3><p className={`text-3xl font-bold mt-2 ${pendingCount > 0 ? 'text-red-600' : 'text-slate-800'}`}>{pendingCount} <span className="text-sm text-slate-400 font-normal">筆</span></p></div> </div> <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"> <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96 overflow-y-auto"><h3 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">熱銷商品 Top 10</h3><ul className="space-y-3">{stats.popularItems.map((item, idx) => (<li key={idx} className="flex justify-between items-center pb-2 border-b border-slate-50 last:border-0"><div className="flex items-center gap-3"><span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'}`}>{idx + 1}</span><span className="text-slate-700 font-medium truncate max-w-[150px] sm:max-w-xs">{item.name}</span></div><div className="text-right"><span className="block font-bold text-slate-800">{item.quantity} 份</span><span className="text-xs text-slate-400">${item.revenue.toLocaleString()}</span></div></li>))}</ul></div> <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100"><h3 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">近七日營收趨勢</h3><div className="space-y-4">{stats.salesTrend.map((day, idx) => { const maxRev = Math.max(...stats.salesTrend.map(d => d.revenue), 1); const percent = (day.revenue / maxRev) * 100; return (<div key={idx} className="flex items-center gap-4"><span className="w-16 text-xs text-slate-500 font-mono">{day.date}</span><div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden relative"><div className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${percent}%` }}></div></div><span className="w-16 text-right text-xs font-bold text-slate-700">${day.revenue}</span></div>) })}</div></div> </div> </div> );
};

const OrderManager = ({ orders, onStatusUpdate }: { orders: Order[], onStatusUpdate: (id: string, status: Order['status']) => void }) => {
    const [filter, setFilter] = useState('all'); const [searchTerm, setSearchTerm] = useState('');
    const filteredOrders = useMemo(() => { let result = orders; if (filter === 'pending') result = orders.filter(o => o.status === '待店長確認' || o.status === '待處理'); else if (filter === 'active') result = orders.filter(o => o.status === '製作中' || o.status === '可以取餐'); else if (filter === 'completed') result = orders.filter(o => o.status === '已完成'); if (searchTerm) { const lower = searchTerm.toLowerCase(); result = result.filter(o => o.id.toLowerCase().includes(lower) || o.customerInfo.name.toLowerCase().includes(lower) || o.customerInfo.phone.includes(lower)); } return result; }, [orders, filter, searchTerm]);
    const statusColors: any = { '待店長確認': 'bg-red-100 text-red-700 border-red-200', '待處理': 'bg-orange-100 text-orange-700 border-orange-200', '製作中': 'bg-blue-100 text-blue-700 border-blue-200', '可以取餐': 'bg-green-100 text-green-700 border-green-200', '已完成': 'bg-slate-100 text-slate-600 border-slate-200', '錯誤': 'bg-gray-200 text-gray-500 border-gray-300 line-through' };
    const downloadCSV = () => { const headers = ['訂單編號', '時間', '顧客姓名', '電話', '桌號', '總金額', '狀態', '內容摘要']; const rows = filteredOrders.map(o => [o.id, new Date(o.createdAt).toLocaleString('zh-TW'), o.customerInfo.name, o.customerInfo.phone, o.customerInfo.tableNumber || '外帶', o.totalPrice, o.status, o.items.map(i => `${i.item.name} x${i.quantity}`).join('; ')]); const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n'); const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `orders_export.csv`; link.click(); };
    return ( <div className="space-y-4 h-full flex flex-col"> <div className="flex flex-col md:flex-row justify-between items-center gap-4"> <div className="flex bg-white rounded-lg shadow-sm p-1 border border-slate-200"> <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>全部</button> <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'pending' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>待處理</button> <button onClick={() => setFilter('active')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'active' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>進行中</button> <button onClick={() => setFilter('completed')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'completed' ? 'bg-green-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>已完成</button> </div> <div className="flex gap-2 w-full md:w-auto"> <input type="text" placeholder="搜尋單號/姓名/電話" className="px-3 py-2 border rounded-md text-sm w-full md:w-64" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /> <button onClick={downloadCSV} className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 whitespace-nowrap"><DownloadIcon className="h-4 w-4"/> 匯出 CSV</button> </div> </div> <div className="flex-1 overflow-auto bg-white rounded-xl shadow-sm border border-slate-200"> <table className="w-full text-left"> <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10"><tr><th className="p-4 font-medium text-slate-500 text-sm">時間 / 單號</th><th className="p-4 font-medium text-slate-500 text-sm">顧客 / 桌號</th><th className="p-4 font-medium text-slate-500 text-sm">內容摘要</th><th className="p-4 font-medium text-slate-500 text-sm">總金額</th><th className="p-4 font-medium text-slate-500 text-sm">狀態</th><th className="p-4 font-medium text-slate-500 text-sm text-right">操作</th></tr></thead> <tbody className="divide-y divide-slate-100"> {filteredOrders.map(order => ( <tr key={order.id} className="hover:bg-slate-50 transition-colors"> <td className="p-4 align-top whitespace-nowrap"><div className="font-mono font-bold text-slate-700">{order.id.slice(-6)}</div><div className="text-xs text-slate-400 mt-1">{new Date(order.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div></td> <td className="p-4 align-top whitespace-nowrap"><div className="font-medium text-slate-800">{order.customerInfo.name}</div><div className="text-xs text-slate-500">{order.orderType} {order.customerInfo.tableNumber ? `(${order.customerInfo.tableNumber})` : ''}</div><div className="text-xs text-slate-400">{order.customerInfo.phone}</div></td> <td className="p-4 align-top max-w-xs"><ul className="text-sm text-slate-600 space-y-1">{order.items.map((item, i) => (<li key={i} className="truncate">{item.item.name.replace(/套餐|半全餐/g, '套餐')} x{item.quantity}</li>))}</ul></td> <td className="p-4 align-top font-bold text-slate-700">${order.totalPrice}</td> <td className="p-4 align-top"><span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[order.status] || 'bg-slate-100'}`}>{order.status}</span></td> <td className="p-4 align-top text-right"><select value={order.status} onChange={(e) => onStatusUpdate(order.id, e.target.value as any)} className="bg-white border border-slate-300 text-slate-700 text-sm rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"><option value="待店長確認">待確認</option><option value="待處理">待處理</option><option value="製作中">製作中</option><option value="可以取餐">可取餐</option><option value="已完成">已完成</option><option value="錯誤">取消/錯誤</option></select></td> </tr> ))} </tbody> </table> </div> </div> );
};

const SalesReports = () => {
    const [activeReport, setActiveReport] = useState<'daily' | 'monthly'>('daily');
    const [date, setDate] = useState(() => { const now = new Date(); return now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0'); });
    const [month, setMonth] = useState(() => { const now = new Date(); return now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0'); });
    const [reportData, setReportData] = useState<DailySalesData | MonthlySalesData | null>(null);
    useEffect(() => { loadData(); }, [activeReport, date, month]);
    const loadData = async () => { if(activeReport === 'daily') { const data = await apiService.getDailySales(date); setReportData(data); } else { const data = await apiService.getMonthlySales(month); setReportData(data); } };
    return ( <div className="space-y-6"> <div className="flex gap-4 border-b border-slate-200 pb-4"> <button onClick={() => setActiveReport('daily')} className={`px-4 py-2 rounded-lg font-bold ${activeReport === 'daily' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>日營收報表</button> <button onClick={() => setActiveReport('monthly')} className={`px-4 py-2 rounded-lg font-bold ${activeReport === 'monthly' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>月營收報表</button> </div> {activeReport === 'daily' && ( <div className="space-y-6 animate-fade-in"> <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow-sm inline-flex"><CalendarIcon className="text-slate-500" /><input type="date" value={date} onChange={e => setDate(e.target.value)} className="outline-none font-bold text-slate-700" /></div> {reportData && 'breakdown' in reportData && ( <> <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> <div className="bg-green-50 p-4 rounded-lg border border-green-100"><h4 className="text-green-800 text-sm font-bold">總營收</h4><p className="text-3xl font-bold text-green-700">${reportData.totalRevenue}</p></div> <div className="bg-blue-50 p-4 rounded-lg border border-blue-100"><h4 className="text-blue-800 text-sm font-bold">總訂單</h4><p className="text-3xl font-bold text-blue-700">{reportData.orderCount} 筆</p></div> <div className="bg-purple-50 p-4 rounded-lg border border-purple-100"><h4 className="text-purple-800 text-sm font-bold">平均客單價</h4><p className="text-3xl font-bold text-purple-700">${reportData.avgOrderValue}</p></div> </div> <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"> <div className="px-6 py-4 bg-slate-50 border-b font-bold text-slate-700">銷售品項明細</div> <table className="w-full text-left"> <thead className="bg-slate-50 text-slate-500 text-xs uppercase"><tr><th className="px-6 py-3">品項名稱</th><th className="px-6 py-3 text-right">數量</th><th className="px-6 py-3 text-right">小計</th></tr></thead> <tbody className="divide-y divide-slate-100">{reportData.breakdown.map((item, idx) => (<tr key={idx} className="hover:bg-slate-50"><td className="px-6 py-3 font-medium text-slate-700">{item.name}</td><td className="px-6 py-3 text-right text-slate-600">{item.quantity}</td><td className="px-6 py-3 text-right font-bold text-slate-800">${item.total}</td></tr>))}</tbody> </table> </div> </> )} </div> )} {activeReport === 'monthly' && ( <div className="space-y-6 animate-fade-in"> <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow-sm inline-flex"><CalendarIcon className="text-slate-500" /><input type="month" value={month} onChange={e => setMonth(e.target.value)} className="outline-none font-bold text-slate-700" /></div> {reportData && 'dailyTrend' in reportData && ( <> <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 text-center"><h4 className="text-indigo-800 font-bold mb-2">本月總營收</h4><p className="text-5xl font-black text-indigo-700">${reportData.totalRevenue.toLocaleString()}</p></div> <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"> <h3 className="font-bold text-slate-700 mb-6">每日營收走勢</h3> <div className="flex items-end gap-1 h-64"> {reportData.dailyTrend.map((d, idx) => { const maxVal = Math.max(...reportData.dailyTrend.map(x => x.revenue), 1); const height = (d.revenue / maxVal) * 100; return ( <div key={idx} className="flex-1 flex flex-col items-center group relative"> <div className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all" style={{ height: `${height}%` }}></div> <span className="text-xs text-slate-400 mt-1">{d.day}</span> <div className="absolute bottom-full mb-2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">${d.revenue}</div> </div> ) })} </div> </div> </> )} </div> )} </div> );
};

const MenuManager = ({ menu, addons, options, onSave }: { menu: MenuCategory[], addons: MenuItem[], options: OptionsData, onSave: (m: MenuCategory[], a: MenuItem[], o: OptionsData) => void }) => {
    const [localMenu, setLocalMenu] = useState(menu);
    const [localAddons, setLocalAddons] = useState(addons);
    const [localOptions, setLocalOptions] = useState(options);
    const [hasChanges, setHasChanges] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null); 
    const [isNewItem, setIsNewItem] = useState(false);

    useEffect(() => { if (!hasChanges) { setLocalMenu(menu); setLocalAddons(addons); setLocalOptions(options); } }, [menu, addons, options, hasChanges]);

    const handleSave = () => { onSave(localMenu, localAddons, localOptions); setHasChanges(false); alert("菜單變更已儲存！"); };
    const handleDeleteItem = (catIdx: number, itemId: string) => { if(!confirm("確定要刪除此品項嗎？")) return; setHasChanges(true); setLocalMenu(prev => { const newMenu = [...prev]; newMenu[catIdx].items = newMenu[catIdx].items.filter(i => i.id !== itemId); return newMenu; }); };
    const handleAddCategory = () => { const title = prompt("請輸入新分類名稱:"); if(title) { setHasChanges(true); setLocalMenu(prev => [...prev, { title, items: [] }]); } };
    const handleDeleteCategory = (catIdx: number) => { if(!confirm("確定要刪除整個分類及其所有品項嗎？")) return; setHasChanges(true); setLocalMenu(prev => prev.filter((_, i) => i !== catIdx)); };
    const handleDeleteAddon = (itemId: string) => { if(!confirm("確定要刪除此加購項目嗎？")) return; setHasChanges(true); setLocalAddons(prev => prev.filter(a => a.id !== itemId)); };

    const openEditModal = (item: any, catIdx: number, isNew = false, isAddon = false) => { setEditingItem({ ...item, catIdx, isAddon }); setIsNewItem(isNew); };
    
    const saveEditItem = () => {
        setHasChanges(true);
        const newItem = { ...editingItem };
        const catIdx = newItem.catIdx;
        const isAddon = newItem.isAddon;
        delete newItem.catIdx;
        delete newItem.isAddon; 
        
        if (isAddon) {
            if(isNewItem) { setLocalAddons(prev => [...prev, newItem]); }
            else { setLocalAddons(prev => prev.map(a => a.id === newItem.id ? newItem : a)); }
        } else {
            if(isNewItem) { setLocalMenu(prev => { const newMenu = [...prev]; newMenu[catIdx].items.push(newItem); return newMenu; }); } 
            else { setLocalMenu(prev => { const newMenu = [...prev]; const cat = newMenu[catIdx]; cat.items = cat.items.map(i => i.id === newItem.id ? newItem : i); return newMenu; }); }
        }
        setEditingItem(null);
    };
    
    const handleToggleAvailable = (catIdx: number, itemId: string) => { setHasChanges(true); setLocalMenu(prev => { const newMenu = [...prev]; const item = newMenu[catIdx].items.find(i => i.id === itemId); if(item) item.isAvailable = !item.isAvailable; return newMenu; }); };
    const handleToggleAddonAvailable = (itemId: string) => { setHasChanges(true); setLocalAddons(prev => prev.map(a => a.id === itemId ? { ...a, isAvailable: !a.isAvailable } : a)); };
    const optionGroups = [ { key: 'sauces', title: '醬料' }, { key: 'dessertsA', title: '甜品 A' }, { key: 'dessertsB', title: '甜品 B' }, { key: 'pastasA', title: '義麵 主' }, { key: 'pastasB', title: '義麵 醬' }, { key: 'coldNoodles', title: '涼麵' }, { key: 'simpleMeals', title: '簡餐' } ];
    const handleToggleOption = (group: string, name: string) => { setHasChanges(true); setLocalOptions(prev => ({ ...prev, [group]: prev[group].map(opt => opt.name === name ? { ...opt, isAvailable: !opt.isAvailable } : opt) })); };

    const addonCategories = ['主餐加購', '單點加購', '簡餐加購', 'Main Addons', 'Side Addons', 'Simple Meal Addon'];

    return (
        <div className="space-y-8 relative">
             <div className="flex justify-between items-center sticky top-0 bg-slate-50 py-4 z-10 border-b"><h2 className="text-2xl font-bold text-slate-800">菜單管理</h2><div className="flex gap-2"><button onClick={handleAddCategory} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold hover:bg-blue-200">+ 新增分類</button><button onClick={handleSave} disabled={!hasChanges} className={`px-6 py-2 rounded-lg font-bold shadow-sm transition-all ${hasChanges ? 'bg-green-600 text-white hover:bg-green-700 scale-105' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>{hasChanges ? '儲存變更' : '無變更'}</button></div></div>
            <div className="grid grid-cols-1 gap-6">
                {localMenu.map((cat, catIdx) => (
                    <div key={catIdx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 font-bold text-slate-700 flex justify-between items-center">
                            <div className="flex items-center gap-2"><span>{cat.title}</span><button onClick={() => handleDeleteCategory(catIdx)} className="text-red-400 hover:text-red-600 ml-2"><TrashIcon className="h-4 w-4"/></button></div>
                            <button onClick={() => openEditModal({ id: `new-${Date.now()}`, name: '新品項', price: 0, isAvailable: true, customizations: {} }, catIdx, true)} className="text-sm bg-white border border-blue-200 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-50">+ 新增餐點</button>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {cat.items.map(item => (
                                <div key={item.id} className={`flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${!item.isAvailable ? 'bg-slate-50/50' : ''}`}>
                                    <div className="flex-1">
                                        <div className={`font-medium ${item.isAvailable ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{item.name}</div>
                                        <div className="text-xs text-slate-400">${item.price} | {item.weight}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleToggleAvailable(catIdx, item.id)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${item.isAvailable ? 'bg-green-500' : 'bg-slate-300'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.isAvailable ? 'translate-x-6' : 'translate-x-1'}`} /></button>
                                        <button onClick={() => openEditModal(item, catIdx)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"><PencilIcon /></button>
                                        <button onClick={() => handleDeleteItem(catIdx, item.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-full"><TrashIcon /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 font-bold text-slate-700 flex justify-between items-center">
                        <span>加購項目 / 單點</span>
                        <button onClick={() => openEditModal({ id: `addon-new-${Date.now()}`, name: '新加購', price: 0, category: '單點加購', isAvailable: true }, -1, true, true)} className="text-sm bg-white border border-blue-200 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-50">+ 新增加購</button>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {localAddons.map(addon => (
                            <div key={addon.id} className={`flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${!addon.isAvailable ? 'bg-slate-50/50' : ''}`}>
                                <div className="flex-1">
                                    <div className={`font-medium ${addon.isAvailable ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{addon.name}</div>
                                    <div className="text-xs text-slate-400">${addon.price} | {addon.category}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleToggleAddonAvailable(addon.id)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${addon.isAvailable ? 'bg-green-500' : 'bg-slate-300'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${addon.isAvailable ? 'translate-x-6' : 'translate-x-1'}`} /></button>
                                    <button onClick={() => openEditModal(addon, -1, false, true)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"><PencilIcon /></button>
                                    <button onClick={() => handleDeleteAddon(addon.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-full"><TrashIcon /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-4 pl-2 border-l-4 border-orange-400">細項選項管理</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {optionGroups.map(group => (
                    <div key={group.key} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-orange-50 px-4 py-3 border-b border-orange-100 font-bold text-orange-800 text-sm">{group.title}</div>
                        <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                            {(localOptions[group.key] || []).map(opt => (
                                <div key={opt.name} className="flex items-center justify-between p-3 hover:bg-slate-50">
                                    <div className={`text-sm font-medium ${opt.isAvailable ? 'text-slate-700' : 'text-slate-400 line-through'}`}>{opt.name}</div>
                                    <button onClick={() => handleToggleOption(group.key, opt.name)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${opt.isAvailable ? 'bg-green-500' : 'bg-slate-300'}`}><span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${opt.isAvailable ? 'translate-x-5' : 'translate-x-1'}`} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            {editingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-slate-800">{isNewItem ? '新增' : '編輯'}{editingItem.isAddon ? '加購項目' : '餐點'}</h3>
                        <div><label className="block text-sm font-bold text-slate-600">名稱 (中文)</label><input className="w-full border p-2 rounded" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /></div>
                        
                        {editingItem.isAddon ? (
                            <div>
                                <label className="block text-sm font-bold text-slate-600">分類</label>
                                <select className="w-full border p-2 rounded" value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})}>
                                    {addonCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                        ) : (
                            <div><label className="block text-sm font-bold text-slate-600">份量/描述</label><input className="w-full border p-2 rounded" value={editingItem.weight || ''} onChange={e => setEditingItem({...editingItem, weight: e.target.value})} placeholder="例如: 7oz (3oz牛+4oz雞)" /></div>
                        )}
                        
                        <div><label className="block text-sm font-bold text-slate-600">價格</label><input type="number" className="w-full border p-2 rounded" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: Number(e.target.value)})} /></div>
                        <div><label className="block text-sm font-bold text-slate-600">廚房列印簡稱</label><input className="w-full border p-2 rounded" value={editingItem.printShortName || (editingItem.isAddon ? editingItem.printName : '') || ''} onChange={e => { if(editingItem.isAddon) setEditingItem({...editingItem, printName: e.target.value}); else setEditingItem({...editingItem, printShortName: e.target.value}); }} placeholder="例如: 板12" /></div>
                        <div><label className="block text-sm font-bold text-slate-600">圖片網址 (Image URL)</label><input className="w-full border p-2 rounded" value={editingItem.image || ''} onChange={e => setEditingItem({...editingItem, image: e.target.value})} placeholder="https://..." /></div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button onClick={() => setEditingItem(null)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded">取消</button>
                            <button onClick={saveEditItem} className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">確認儲存</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Settings = ({ isQuietHours, onToggleQuiet, onBackup, onRestore, onClear }: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; try { await onRestore(file); alert('資料還原成功！頁面將重新整理。'); window.location.reload(); } catch (err) { alert('資料還原失敗，請確認檔案格式是否正確。'); } };
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"><div className="flex items-center justify-between"><div><h3 className="font-bold text-slate-800 text-lg">店家休息模式 (Quiet Hours)</h3><p className="text-sm text-slate-500 mt-1">啟用後，前台點餐頁面將顯示「休息中」並停止接受新訂單。</p></div><button onClick={() => onToggleQuiet(!isQuietHours)} className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${isQuietHours ? 'bg-indigo-600' : 'bg-slate-300'}`}><span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isQuietHours ? 'translate-x-7' : 'translate-x-1'}`} /></button></div></div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"><h3 className="font-bold text-slate-800 text-lg mb-4">資料備份與還原</h3><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><button onClick={onBackup} className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-700"><DownloadIcon className="h-5 w-5"/> 備份資料 (JSON)</button><div className="relative"><input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" /><button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-700"><UploadIcon className="h-5 w-5"/> 還原資料</button></div></div></div>
            <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-100"><h3 className="font-bold text-red-800 text-lg mb-2">危險區域</h3><p className="text-sm text-red-600 mb-4">清除所有訂單資料（包含營收統計）。建議在每月結算備份後執行。</p><button onClick={onClear} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">清除所有訂單資料</button></div>
        </div>
    );
};

interface AdminPanelProps {
    onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [addons, setAddons] = useState<MenuItem[]>([]);
  const [options, setOptions] = useState<OptionsData>({ sauces: [], dessertsA: [], dessertsB: [], pastasA: [], pastasB: [], coldNoodles: [], simpleMeals: [] });
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [isQuietHours, setIsQuietHours] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
        const { menu: m, addons: ad, options: o, isQuietHours: q } = await apiService.getMenuAndAddons();
        const allOrders = await apiService.getAllOrders();
        const statistics = await apiService.getSalesStatistics();
        setMenu(m); setAddons(ad); setOptions(o); setIsQuietHours(q); setOrders(allOrders); setStats(statistics);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); const interval = setInterval(fetchData, 15000); return () => clearInterval(interval); }, []);
  const handleStatusUpdate = async (id: string, status: Order['status']) => { await apiService.updateOrderStatus(id, status); fetchData(); };
  const handleSaveMenu = async (m: MenuCategory[], ad: MenuItem[], o: OptionsData) => { await apiService.saveMenuConfig(m, ad, o); fetchData(); };
  const handleToggleQuiet = async (val: boolean) => { await apiService.updateQuietHours(val); fetchData(); };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-50 transition-all duration-300 hidden md:flex">
        <div className="p-6 border-b border-slate-800"><h1 className="text-2xl font-bold text-white">無名牛排 <span className="text-xs text-indigo-400 block mt-1">管理後台</span></h1></div>
        <nav className="flex-1 py-6 space-y-1">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-colors ${activeTab === 'dashboard' ? 'bg-slate-800 text-white border-r-4 border-indigo-500' : ''}`}><HomeIcon /> 總覽看板</button>
            <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-colors ${activeTab === 'reports' ? 'bg-slate-800 text-white border-r-4 border-indigo-500' : ''}`}><ChartBarIcon /> 營收報表</button>
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-colors ${activeTab === 'orders' ? 'bg-slate-800 text-white border-r-4 border-indigo-500' : ''}`}><ClipboardListIcon /> 訂單管理 {orders.filter(o => o.status === '待處理' || o.status === '待店長確認').length > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{orders.filter(o => o.status === '待處理' || o.status === '待店長確認').length}</span>}</button>
            <button onClick={() => setActiveTab('menu')} className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-colors ${activeTab === 'menu' ? 'bg-slate-800 text-white border-r-4 border-indigo-500' : ''}`}><MenuIcon /> 菜單管理</button>
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-colors ${activeTab === 'settings' ? 'bg-slate-800 text-white border-r-4 border-indigo-500' : ''}`}><CogIcon /> 系統設定</button>
        </nav>
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center"><button onClick={onBack} className="hover:text-white underline flex items-center justify-center w-full gap-2">← 返回點餐前台</button></div>
      </aside>
      <div className="md:hidden fixed w-full bg-slate-900 text-white z-50 p-4 flex justify-between items-center"><span className="font-bold">管理後台</span><div className="flex gap-3"><button onClick={() => setActiveTab('dashboard')} className={`text-sm ${activeTab === 'dashboard' ? 'text-indigo-400' : ''}`}>總覽</button><button onClick={() => setActiveTab('reports')} className={`text-sm ${activeTab === 'reports' ? 'text-indigo-400' : ''}`}>報表</button><button onClick={() => setActiveTab('orders')} className={`text-sm ${activeTab === 'orders' ? 'text-indigo-400' : ''}`}>訂單</button><button onClick={() => setActiveTab('menu')} className={`text-sm ${activeTab === 'menu' ? 'text-indigo-400' : ''}`}>菜單</button><button onClick={onBack} className="text-sm text-slate-400">離開</button></div></div>
      <main className="flex-1 md:ml-64 p-4 md:p-8 mt-14 md:mt-0 overflow-x-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"><h2 className="text-2xl font-bold text-slate-800">{activeTab === 'dashboard' && '營運總覽'}{activeTab === 'reports' && '營收報表'}{activeTab === 'orders' && '即時訂單'}{activeTab === 'menu' && '菜單品項管理'}{activeTab === 'settings' && '系統設定'}</h2><div className="flex gap-3"><button onClick={() => fetchData()} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 text-slate-700 transition-all active:scale-95"><RefreshIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> <span className="hidden md:inline">重整數據</span></button></div></header>
        <div className="animate-fade-in pb-10">
            {activeTab === 'dashboard' && <Dashboard stats={stats} orders={orders} />}
            {activeTab === 'reports' && <SalesReports />}
            {activeTab === 'orders' && <OrderManager orders={orders} onStatusUpdate={handleStatusUpdate} />}
            {activeTab === 'menu' && <MenuManager menu={menu} addons={addons} options={options} onSave={handleSaveMenu} />}
            {activeTab === 'settings' && <Settings isQuietHours={isQuietHours} onToggleQuiet={handleToggleQuiet} onBackup={apiService.backupData} onRestore={apiService.restoreData} onClear={apiService.clearAllData} />}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;