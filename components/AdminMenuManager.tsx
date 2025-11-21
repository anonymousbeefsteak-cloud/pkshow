
import React, { useState, useEffect } from 'react';
import { MenuCategory, Addon, OptionsData, MenuItem } from '../types';
import { apiService } from '../services/apiService';

interface MenuManagerProps {
    menu: MenuCategory[];
    addons: Addon[];
    options: OptionsData;
    onSave: (menu: MenuCategory[], addons: Addon[], options: OptionsData) => void;
}

// Helper modal for editing a menu item
const EditItemModal = ({ item, onClose, onSave }: { item: MenuItem, onClose: () => void, onSave: (updated: MenuItem) => void }) => {
    const [name, setName] = useState(item.name);
    const [price, setPrice] = useState(item.price);
    const [description, setDescription] = useState(item.description || '');
    const [image, setImage] = useState(item.image || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...item, name, price, description, image });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-lg">編輯餐點</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">名稱</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">價格</label>
                        <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full border p-2 rounded" required min="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">圖片網址 (URL)</label>
                        <input type="text" value={image} onChange={e => setImage(e.target.value)} className="w-full border p-2 rounded" placeholder="https://..." />
                        {image && <img src={image} alt="Preview" className="mt-2 h-20 object-cover rounded border" />}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border p-2 rounded" rows={3} />
                    </div>
                    <div className="pt-2 flex gap-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2 bg-slate-100 rounded hover:bg-slate-200">取消</button>
                        <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">確認修改</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const AdminMenuManager: React.FC<MenuManagerProps> = ({ menu, addons, options, onSave }) => {
    const [localMenu, setLocalMenu] = useState(menu);
    const [localAddons, setLocalAddons] = useState(addons);
    const [localOptions, setLocalOptions] = useState(options);
    const [hasChanges, setHasChanges] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

    useEffect(() => { if (!hasChanges) { setLocalMenu(menu); setLocalAddons(addons); setLocalOptions(options); } }, [menu, addons, options, hasChanges]);

    const handleToggleItem = (id: string) => { 
        setHasChanges(true); 
        setLocalMenu(prev => prev.map(cat => ({ ...cat, items: cat.items.map(item => item.id === id ? { ...item, isAvailable: !item.isAvailable } : item) }))); 
        setLocalAddons(prev => prev.map(a => a.id === id ? { ...a, isAvailable: !a.isAvailable } : a)); 
    };
    
    const handleItemUpdate = (updatedItem: MenuItem) => {
        setHasChanges(true);
        setLocalMenu(prev => prev.map(cat => ({
            ...cat,
            items: cat.items.map(item => item.id === updatedItem.id ? updatedItem : item)
        })));
        // Addons logic logic mostly handled by direct edits if needed, but main request is menu items
        setEditingItem(null);
    };
    
    const handleToggleOption = (group: keyof OptionsData, name: string) => { 
        setHasChanges(true); 
        setLocalOptions(prev => ({ ...prev, [group]: prev[group].map(opt => opt.name === name ? { ...opt, isAvailable: !opt.isAvailable } : opt) })); 
    };
    
    const handleSave = () => { onSave(localMenu, localAddons, localOptions); setHasChanges(false); alert("菜單變更已儲存！"); };
    
    const handleResetDefaults = async () => {
        if (confirm("確定要還原成系統預設菜單嗎？\n所有自訂修改（名稱、價格、圖片）都將遺失！")) {
            await apiService.resetMenuToDefault();
            window.location.reload(); // Simple reload to fetch defaults
        }
    };

    const optionGroups = [
        { key: 'sauces', title: '醬料選擇' }, 
        { key: 'dessertsA', title: '甜品 A區' }, 
        { key: 'dessertsB', title: '甜品 B區' }, 
        { key: 'pastasA', title: '義麵 主食' }, 
        { key: 'pastasB', title: '義麵 醬料' }, 
        { key: 'coldNoodles', title: '涼麵口味' }, 
        { key: 'simpleMeals', title: '簡餐主餐' }
    ] as const;

    return (
        <div className="space-y-8 relative">
             <div className="flex flex-wrap justify-between items-center gap-4">
                 <h2 className="text-2xl font-bold text-slate-800">菜單管理</h2>
                 <div className="flex gap-2">
                     <button onClick={handleResetDefaults} className="px-4 py-2 rounded-lg font-bold bg-red-100 text-red-700 hover:bg-red-200 transition-colors text-sm">⚠️ 還原預設菜單</button>
                     <button onClick={handleSave} disabled={!hasChanges} className={`px-6 py-2 rounded-lg font-bold shadow-sm transition-all ${hasChanges ? 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md scale-105' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>{hasChanges ? '儲存變更' : '無變更'}</button>
                 </div>
             </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {localMenu.map(cat => (
                    <div key={cat.title} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 font-bold text-slate-700 flex justify-between items-center">{cat.title}<span className="text-xs font-normal text-slate-400">{cat.items.length} 品項</span></div>
                        <div className="divide-y divide-slate-100">{cat.items.map(item => (
                            <div key={item.id} className={`flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${!item.isAvailable ? 'bg-slate-50/50' : ''}`}>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        {item.image && <img src={item.image} alt="" className="w-8 h-8 rounded object-cover" />}
                                        <div className={`font-medium ${item.isAvailable ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{item.name}</div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="text-sm font-bold text-green-700">${item.price}</span>
                                        <button onClick={() => setEditingItem(item)} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200">編輯內容/圖片</button>
                                    </div>
                                </div>
                                <button onClick={() => handleToggleItem(item.id)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${item.isAvailable ? 'bg-green-500' : 'bg-slate-300'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.isAvailable ? 'translate-x-6' : 'translate-x-1'}`} /></button>
                            </div>
                        ))}</div>
                    </div>
                ))}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 font-bold text-slate-700">加購項目 (僅支援開關/價格)</div>
                    <div className="divide-y divide-slate-100">{localAddons.map(addon => (<div key={addon.id} className={`flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${!addon.isAvailable ? 'bg-slate-50/50' : ''}`}><div className="flex-1"><div className={`font-medium ${addon.isAvailable ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{addon.name}</div><span className="text-sm text-slate-500">${addon.price}</span></div><button onClick={() => handleToggleItem(addon.id)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${addon.isAvailable ? 'bg-green-500' : 'bg-slate-300'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${addon.isAvailable ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>))}</div>
                </div>
            </div>
            <div><h3 className="text-xl font-bold text-slate-800 mb-4 pl-2 border-l-4 border-orange-400">細項選項管理</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{optionGroups.map(group => (<div key={group.key} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"><div className="bg-orange-50 px-4 py-3 border-b border-orange-100 font-bold text-orange-800 text-sm">{group.title}</div><div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">{(localOptions[group.key] || []).map(opt => (<div key={opt.name} className="flex items-center justify-between p-3 hover:bg-slate-50"><div className={`text-sm font-medium ${opt.isAvailable ? 'text-slate-700' : 'text-slate-400 line-through'}`}>{opt.name}</div><button onClick={() => handleToggleOption(group.key, opt.name)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${opt.isAvailable ? 'bg-green-500' : 'bg-slate-300'}`}><span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${opt.isAvailable ? 'translate-x-5' : 'translate-x-1'}`} /></button></div>))}</div></div>))}</div></div>
            
            {editingItem && <EditItemModal item={editingItem} onClose={() => setEditingItem(null)} onSave={handleItemUpdate} />}
        </div>
    );
};
