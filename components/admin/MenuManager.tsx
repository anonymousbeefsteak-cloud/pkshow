import React, { useState, useEffect } from 'react';
import { MenuCategory, Addon, OptionsData } from '../../types';

interface MenuManagerProps {
    menu: MenuCategory[];
    addons: Addon[];
    options: OptionsData;
    onSave: (menu: MenuCategory[], addons: Addon[], options: OptionsData) => void;
}

export const MenuManager: React.FC<MenuManagerProps> = ({ menu, addons, options, onSave }) => {
    const [localMenu, setLocalMenu] = useState(menu);
    const [localAddons, setLocalAddons] = useState(addons);
    const [localOptions, setLocalOptions] = useState(options);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => { if (!hasChanges) { setLocalMenu(menu); setLocalAddons(addons); setLocalOptions(options); } }, [menu, addons, options, hasChanges]);

    const handleToggleItem = (id: string) => { 
        setHasChanges(true); 
        setLocalMenu(prev => prev.map(cat => ({ ...cat, items: cat.items.map(item => item.id === id ? { ...item, isAvailable: !item.isAvailable } : item) }))); 
        setLocalAddons(prev => prev.map(a => a.id === id ? { ...a, isAvailable: !a.isAvailable } : a)); 
    };
    
    const handleUpdatePrice = (id: string, newPrice: number) => { 
        setHasChanges(true); 
        setLocalMenu(prev => prev.map(cat => ({ ...cat, items: cat.items.map(item => item.id === id ? { ...item, price: newPrice } : item) }))); 
        setLocalAddons(prev => prev.map(a => a.id === id ? { ...a, price: newPrice } : a)); 
    };
    
    const handleToggleOption = (group: keyof OptionsData, name: string) => { 
        setHasChanges(true); 
        setLocalOptions(prev => ({ ...prev, [group]: prev[group].map(opt => opt.name === name ? { ...opt, isAvailable: !opt.isAvailable } : opt) })); 
    };
    
    const handleSave = () => { onSave(localMenu, localAddons, localOptions); setHasChanges(false); alert("菜單變更已儲存！"); };
    const requestPriceChange = (id: string, currentPrice: number) => { const val = prompt("請輸入新價格:", currentPrice.toString()); if (val !== null && !isNaN(Number(val)) && Number(val) >= 0) { handleUpdatePrice(id, Number(val)); } };

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
             <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-slate-800">菜單管理</h2><button onClick={handleSave} disabled={!hasChanges} className={`px-6 py-2 rounded-lg font-bold shadow-sm transition-all ${hasChanges ? 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md scale-105' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>{hasChanges ? '儲存變更' : '無變更'}</button></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {localMenu.map(cat => (
                    <div key={cat.title} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 font-bold text-slate-700 flex justify-between items-center">{cat.title}<span className="text-xs font-normal text-slate-400">{cat.items.length} 品項</span></div>
                        <div className="divide-y divide-slate-100">{cat.items.map(item => (<div key={item.id} className={`flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${!item.isAvailable ? 'bg-slate-50/50' : ''}`}><div className="flex-1"><div className={`font-medium ${item.isAvailable ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{item.name}</div><button onClick={() => requestPriceChange(item.id, item.price)} className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1">${item.price} <span className="text-xs text-slate-400">(點擊修改)</span></button></div><button onClick={() => handleToggleItem(item.id)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${item.isAvailable ? 'bg-green-500' : 'bg-slate-300'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.isAvailable ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>))}</div>
                    </div>
                ))}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 font-bold text-slate-700">加購項目 / 單點</div>
                    <div className="divide-y divide-slate-100">{localAddons.map(addon => (<div key={addon.id} className={`flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${!addon.isAvailable ? 'bg-slate-50/50' : ''}`}><div className="flex-1"><div className={`font-medium ${addon.isAvailable ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{addon.name}</div><button onClick={() => requestPriceChange(addon.id, addon.price)} className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1">${addon.price} <span className="text-xs text-slate-400">(點擊修改)</span></button></div><button onClick={() => handleToggleItem(addon.id)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${addon.isAvailable ? 'bg-green-500' : 'bg-slate-300'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${addon.isAvailable ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>))}</div>
                </div>
            </div>
            <div><h3 className="text-xl font-bold text-slate-800 mb-4 pl-2 border-l-4 border-orange-400">細項選項管理</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{optionGroups.map(group => (<div key={group.key} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"><div className="bg-orange-50 px-4 py-3 border-b border-orange-100 font-bold text-orange-800 text-sm">{group.title}</div><div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">{(localOptions[group.key] || []).map(opt => (<div key={opt.name} className="flex items-center justify-between p-3 hover:bg-slate-50"><div className={`text-sm font-medium ${opt.isAvailable ? 'text-slate-700' : 'text-slate-400 line-through'}`}>{opt.name}</div><button onClick={() => handleToggleOption(group.key, opt.name)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${opt.isAvailable ? 'bg-green-500' : 'bg-slate-300'}`}><span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${opt.isAvailable ? 'translate-x-5' : 'translate-x-1'}`} /></button></div>))}</div></div>))}</div></div>
        </div>
    );
};