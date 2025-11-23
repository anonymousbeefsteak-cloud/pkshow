import React, { useState, useEffect, useMemo } from 'react';
import { MenuItem, Addon, OptionsData, CartItem } from '../types';
import { PlusIcon, MinusIcon, CloseIcon } from './Icons';
import { DONENESS_LEVELS, DONENESS_LEVELS_EN } from '../constants';

interface ItemModalProps {
  selectedItem: { item: MenuItem; category: string };
  editingItem: CartItem | null;
  addons: Addon[];
  options: OptionsData;
  onClose: () => void;
  onConfirmSelection: (item: MenuItem, quantity: number, selections: any, categoryTitle: string) => void;
  t: any;
}

export const ItemModal: React.FC<ItemModalProps> = ({ selectedItem, editingItem, addons: allAddons, options, onClose, onConfirmSelection, t }) => {
    const { item, category } = selectedItem;
    const custom = item.customizations;
    const [quantity, setQuantity] = useState(1);
    const [selectedDonenesses, setSelectedDonenesses] = useState<Record<string, number>>({});
    const [selectedSauces, setSelectedSauces] = useState<{ name: string; quantity: number }[]>([]);
    const [selectedDrinks, setSelectedDrinks] = useState<Record<string, number>>({});
    const [selectedDesserts, setSelectedDesserts] = useState<{ name: string; quantity: number }[]>([]);
    const [selectedPastas, setSelectedPastas] = useState<{ name: string; quantity: number }[]>([]);
    const [selectedComponent, setSelectedComponent] = useState<Record<string, number>>({});
    const [selectedSideChoices, setSelectedSideChoices] = useState<Record<string, number>>({});
    const [selectedMultiChoice, setSelectedMultiChoice] = useState<Record<string, number>>({});
    const [selectedSingleChoiceAddon, setSelectedSingleChoiceAddon] = useState<{name: string, price: number} | undefined>(undefined);
    const [selectedNotes, setSelectedNotes] = useState('');
    const [selectedAddons, setSelectedAddons] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);
    const [validationError, setValidationError] = useState<string | null>(null);

    useEffect(() => {
        if (editingItem) {
          setQuantity(editingItem.quantity);
          setSelectedDonenesses(editingItem.selectedDonenesses || {});
          setSelectedSauces(editingItem.selectedSauces || []);
          setSelectedDrinks(editingItem.selectedDrinks || {});
          setSelectedDesserts(editingItem.selectedDesserts || []);
          setSelectedPastas(editingItem.selectedPastas || []);
          setSelectedComponent(editingItem.selectedComponent || {});
          setSelectedSideChoices(editingItem.selectedSideChoices || {});
          setSelectedMultiChoice(editingItem.selectedMultiChoice || {});
          setSelectedSingleChoiceAddon(editingItem.selectedSingleChoiceAddon);
          setSelectedNotes(editingItem.selectedNotes || '');
          setSelectedAddons(editingItem.selectedAddons || []);
        } else {
          setQuantity(1); setSelectedDonenesses({}); setSelectedSauces([]); setSelectedDrinks({}); setSelectedDesserts([]); setSelectedPastas([]); setSelectedComponent({}); setSelectedSideChoices({}); setSelectedMultiChoice({}); setSelectedSingleChoiceAddon(undefined); setSelectedNotes(''); setSelectedAddons([]);
        }
    }, [editingItem]);

    const handleDonenessChange = (level: string, change: number) => {
        setValidationError(null);
        setSelectedDonenesses(prev => {
            const currentCount = prev[level] || 0;
            const newCount = Math.max(0, currentCount + change);
            const totalCount = Object.values({ ...prev, [level]: newCount }).reduce((sum, count) => sum + (Number(count) || 0), 0);
            if (totalCount > quantity) return prev;
            const newObject = { ...prev, [level]: newCount };
            if (newCount === 0) delete newObject[level];
            return newObject;
        });
    };

    const handleOptionChange = (setter: React.Dispatch<React.SetStateAction<Record<string, number>>>, name: string, change: number, limit: number) => {
        setValidationError(null);
        setter(prev => {
          const currentCount = prev[name] || 0;
          const newCount = Math.max(0, currentCount + change);
          const tempState = { ...prev, [name]: newCount };
          const totalCount = Object.values(tempState).reduce((sum, val) => sum + val, 0);
          if (totalCount > limit) return prev;
          const newObject = { ...prev, [name]: newCount };
          if (newCount === 0) delete newObject[name];
          return newObject;
        });
    };

    const handleArrayOfObjectsChange = (setter: React.Dispatch<React.SetStateAction<{ name: string; quantity: number }[]>>, name: string, change: number, limit: number, group?: string[]) => {
        setValidationError(null);
        setter(prev => {
          const itemsToConsider = group ? prev.filter(item => group.includes(item.name)) : prev;
          const totalCount = itemsToConsider.reduce((sum, item) => sum + item.quantity, 0);
          const existingItem = prev.find(item => item.name === name);
          const newQuantity = (existingItem?.quantity || 0) + change;
          if (newQuantity > (existingItem?.quantity || 0) && totalCount >= limit) return prev;
          if (newQuantity <= 0) return prev.filter(item => item.name !== name);
          if (existingItem) return prev.map(item => item.name === name ? { ...item, quantity: newQuantity } : item);
          return [...prev, { name, quantity: newQuantity }];
        });
    };

    const handleAddonChange = (addon: Addon, change: number) => {
        setSelectedAddons(prev => {
          const existingAddon = prev.find(a => a.id === addon.id);
          const newQuantity = (existingAddon?.quantity || 0) + change;
          if (newQuantity <= 0) return prev.filter(a => a.id !== addon.id);
          if (existingAddon) return prev.map(a => a.id === addon.id ? { ...a, quantity: newQuantity } : a);
          return [...prev, { ...addon, quantity: newQuantity }];
        });
    };

    const totalPrice = useMemo(() => {
        const singleChoicePrice = selectedSingleChoiceAddon && custom.singleChoiceAddon ? custom.singleChoiceAddon.price : 0;
        const addonsPrice = selectedAddons.reduce((sum, addon) => sum + addon.price * addon.quantity, 0);
        return (item.price + singleChoicePrice) * quantity + addonsPrice;
    }, [item.price, quantity, selectedAddons, selectedSingleChoiceAddon, custom.singleChoiceAddon]);

    const donenessCount = useMemo(() => Object.values(selectedDonenesses).reduce((a, b) => a + (b || 0), 0), [selectedDonenesses]);
    const sauceLimit = useMemo(() => (custom.saucesPerItem ? custom.saucesPerItem * quantity : quantity), [custom.saucesPerItem, quantity]);
    const sauceCount = useMemo(() => selectedSauces.reduce((sum, s) => sum + s.quantity, 0), [selectedSauces]);
    const drinkCount = useMemo(() => Object.values(selectedDrinks).reduce((a, b) => a + b, 0), [selectedDrinks]);
    const componentCount = useMemo(() => Object.values(selectedComponent).reduce((a, b) => a + b, 0), [selectedComponent]);
    const sideChoiceLimit = useMemo(() => (custom.sideChoice ? custom.sideChoice.choices * quantity : 0), [custom.sideChoice, quantity]);
    const sideChoiceCount = useMemo(() => Object.values(selectedSideChoices).reduce((a, b) => a + b, 0), [selectedSideChoices]);
    const multiChoiceCount = useMemo(() => Object.values(selectedMultiChoice).reduce((a, b) => a + b, 0), [selectedMultiChoice]);
    
    const dessertACount = useMemo(() => { if (!custom.dessertChoice) return 0; const dessertGroupA = options.dessertsA.map(d => d.name); return selectedDesserts.filter(d => dessertGroupA.includes(d.name)).reduce((s, d) => s + d.quantity, 0); }, [selectedDesserts, options.dessertsA, custom.dessertChoice]);
    const dessertBCount = useMemo(() => { if (!custom.dessertChoice) return 0; const dessertGroupB = options.dessertsB.map(d => d.name); return selectedDesserts.filter(d => dessertGroupB.includes(d.name)).reduce((s, d) => s + d.quantity, 0); }, [selectedDesserts, options.dessertsB, custom.dessertChoice]);
    const pastaACount = useMemo(() => { if (!custom.pastaChoice) return 0; const pastaGroupA = options.pastasA.map(p => p.name); return selectedPastas.filter(p => pastaGroupA.includes(p.name)).reduce((s, p) => s + p.quantity, 0); }, [selectedPastas, options.pastasA, custom.pastaChoice]);
    const pastaBCount = useMemo(() => { if (!custom.pastaChoice) return 0; const pastaGroupB = options.pastasB.map(p => p.name); return selectedPastas.filter(p => pastaGroupB.includes(p.name)).reduce((s, p) => s + p.quantity, 0); }, [selectedPastas, options.pastasB, custom.pastaChoice]);
    
    const multiChoiceOptions = useMemo(() => {
        if (!custom.multiChoice) return [];
        if (custom.multiChoice.title.includes('涼麵') || custom.multiChoice.title.includes('Flavor')) return options.coldNoodles;
        if (custom.multiChoice.title.includes('主餐選擇') || custom.multiChoice.title.includes('Select Main')) return options.simpleMeals || [];
        return custom.multiChoice.options.map(name => ({ name, isAvailable: true }));
    }, [custom.multiChoice, options]);

    const isEnglish = t.title === "No Name Steak";
    const currentDonenessLevels = isEnglish ? DONENESS_LEVELS_EN : DONENESS_LEVELS;

    const handleConfirm = () => {
        setValidationError(null);
        if (custom.doneness && donenessCount !== quantity) { setValidationError(`${t.options.required} ${quantity} ${t.options.portion} ${t.options.doneness}`); return; }
        if (custom.sauceChoice) { const limit = custom.saucesPerItem ? custom.saucesPerItem * quantity : quantity; if (sauceCount > limit) { setValidationError(`${t.options.max} ${limit} ${t.options.portion} ${t.options.sauce}`); return; } }
        if (custom.drinkChoice && drinkCount !== quantity) { setValidationError(`${t.options.required} ${quantity} ${t.options.portion} ${t.options.drink}`); return; }
        if (custom.dessertChoice) { if (dessertACount !== quantity || dessertBCount !== quantity) { setValidationError(`${t.options.dessertA} & ${t.options.dessertB} ${t.options.required} ${quantity} ${t.options.portion}`); return; } }
        if (custom.pastaChoice) { if (pastaACount !== quantity || pastaBCount !== quantity) { setValidationError(`${t.options.pastaMain} & ${t.options.pastaSauce} ${t.options.required} ${quantity} ${t.options.portion}`); return; } }
        if (custom.componentChoice && componentCount !== quantity) { setValidationError(`${custom.componentChoice.title} ${t.options.required} ${quantity} ${t.options.portion}`); return; }
        if (custom.sideChoice) { const limit = custom.sideChoice.choices * quantity; if (sideChoiceCount !== limit) { setValidationError(`${custom.sideChoice.title} ${t.options.required} ${limit} ${t.options.portion}`); return; } }
        if (custom.multiChoice && multiChoiceCount !== quantity) { setValidationError(`${custom.multiChoice.title} ${t.options.required} ${quantity} ${t.options.portion}`); return; }

        onConfirmSelection(item, quantity, { donenesses: selectedDonenesses, sauces: selectedSauces, drinks: selectedDrinks, desserts: selectedDesserts, pastas: selectedPastas, componentChoices: selectedComponent, sideChoices: selectedSideChoices, multiChoice: selectedMultiChoice, singleChoiceAddon: selectedSingleChoiceAddon, notes: selectedNotes, addons: selectedAddons, }, category);
        onClose();
    };
    
    const renderSimpleCounter = (label: string, count: number, onIncrement: () => void, onDecrement: () => void) => (
        <div key={label} className="flex justify-between items-center bg-white p-3 rounded-md"><span className="text-sm font-medium text-slate-800">{label}</span><div className="flex items-center gap-2"><button onClick={onDecrement} className="p-1 rounded-full bg-slate-200 hover:bg-slate-300"><MinusIcon className="h-4 w-4" /></button><span className="font-semibold w-6 text-center">{count}</span><button onClick={onIncrement} className="p-1 rounded-full bg-slate-200 hover:bg-slate-300"><PlusIcon className="h-4 w-4" /></button></div></div>
    );
    
    const renderChoiceCounter = (choice: { name: string, isAvailable: boolean }, currentCount: number, onIncrement: () => void, onDecrement: () => void) => {
        const { name, isAvailable } = choice;
        return (
          <div key={name} className={`flex justify-between items-center bg-white p-3 rounded-md ${!isAvailable && currentCount === 0 ? 'opacity-50' : ''}`}><div className="flex flex-col"><span className={`text-sm font-medium text-slate-800 ${!isAvailable ? 'line-through' : ''}`}>{name}</span>{!isAvailable && <span className="text-xxs font-bold text-red-600">{t.soldOut}</span>}</div><div className="flex items-center gap-2"><button onClick={onDecrement} className="p-1 rounded-full bg-slate-200 hover:bg-slate-300 disabled:opacity-50" disabled={currentCount === 0}><MinusIcon className="h-4 w-4" /></button><span className="font-semibold w-6 text-center">{currentCount}</span><button onClick={onIncrement} className="p-1 rounded-full bg-slate-200 hover:bg-slate-300 disabled:opacity-50" disabled={!isAvailable}><PlusIcon className="h-4 w-4" /></button></div></div>
        );
    };

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
            <header className="p-5 relative border-b bg-white shadow-sm flex-shrink-0"><button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"><CloseIcon /></button><h2 className="text-2xl font-bold text-slate-800">{item.name.replace(/半全餐|半套餐/g, '套餐')}</h2><p className="text-slate-500 mt-1">{item.description}</p></header>
            <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 space-y-6">
                {custom.doneness && <div className="p-4 bg-slate-100 rounded-lg"><h3 className="font-semibold text-slate-700 mb-3">{t.options.doneness} <span className="text-sm font-normal text-slate-500">({t.options.selected} {donenessCount} / {t.options.required} {quantity} {t.options.portion})</span></h3><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">{currentDonenessLevels.map(level => renderSimpleCounter(level, selectedDonenesses[level] || 0, () => handleDonenessChange(level, 1), () => handleDonenessChange(level, -1)))}</div></div>}
                {custom.sauceChoice && <div className="p-4 bg-slate-100 rounded-lg"><h3 className="font-semibold text-slate-700 mb-3">{t.options.sauce} <span className="text-sm font-normal text-slate-500">({t.options.selected} {sauceCount} / {t.options.max} {sauceLimit} {t.options.portion})</span></h3><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">{options.sauces.map(sauce => renderChoiceCounter(sauce, selectedSauces.find(s => s.name === sauce.name)?.quantity || 0, () => { if(sauce.isAvailable) handleArrayOfObjectsChange(setSelectedSauces, sauce.name, 1, sauceLimit) }, () => handleArrayOfObjectsChange(setSelectedSauces, sauce.name, -1, sauceLimit)))}</div></div>}
                {custom.drinkChoice && <div className="p-4 bg-slate-100 rounded-lg"><h3 className="font-semibold text-slate-700 mb-3">{t.options.drink} <span className="text-sm font-normal text-slate-500">({t.options.selected} {drinkCount} / {t.options.required} {quantity} {t.options.portion})</span></h3><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">{(isEnglish ? ['Black Tea', 'Cola'] : ['無糖紅茶', '冰涼可樂']).map(drink => renderSimpleCounter(drink, selectedDrinks[drink] || 0, () => handleOptionChange(setSelectedDrinks, drink, 1, quantity), () => handleOptionChange(setSelectedDrinks, drink, -1, quantity)))}</div></div>}
                {custom.componentChoice && <div className="p-4 bg-slate-100 rounded-lg"><h3 className="font-semibold text-slate-700 mb-3">{custom.componentChoice.title} <span className="text-sm font-normal text-slate-500">({t.options.selected} {componentCount} / {t.options.required} {quantity} {t.options.portion})</span></h3><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">{custom.componentChoice.options.map(c => renderSimpleCounter(c, selectedComponent[c] || 0, () => handleOptionChange(setSelectedComponent, c, 1, quantity), () => handleOptionChange(setSelectedComponent, c, -1, quantity)))}</div></div>}
                {custom.sideChoice && <div className="p-4 bg-slate-100 rounded-lg"><h3 className="font-semibold text-slate-700 mb-3">{custom.sideChoice.title} <span className="text-sm font-normal text-slate-500">({t.options.selected} {sideChoiceCount} / {t.options.required} {sideChoiceLimit} {t.options.portion})</span></h3><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">{custom.sideChoice.options.map(s => renderSimpleCounter(s, selectedSideChoices[s] || 0, () => handleOptionChange(setSelectedSideChoices, s, 1, sideChoiceLimit), () => handleOptionChange(setSelectedSideChoices, s, -1, sideChoiceLimit)))}</div></div>}
                {custom.multiChoice && <div className="p-4 bg-slate-100 rounded-lg"><h3 className="font-semibold text-slate-700 mb-3">{custom.multiChoice.title} <span className="text-sm font-normal text-slate-500">({t.options.selected} {multiChoiceCount} / {t.options.required} {quantity} {t.options.portion})</span></h3><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">{multiChoiceOptions.map(choice => renderChoiceCounter( choice, selectedMultiChoice[choice.name] || 0, () => { if (choice.isAvailable) handleOptionChange(setSelectedMultiChoice, choice.name, 1, quantity); }, () => handleOptionChange(setSelectedMultiChoice, choice.name, -1, quantity) ))}</div></div>}
                {custom.dessertChoice && <><div className="p-4 bg-slate-100 rounded-lg"><h3 className="font-semibold text-slate-700 mb-3">{t.options.dessertA} <span className="text-sm font-normal text-slate-500">({t.options.selected} {dessertACount} / {t.options.required} {quantity} {t.options.portion})</span></h3><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">{options.dessertsA.map(dessert => renderChoiceCounter(dessert, selectedDesserts.find(s => s.name === dessert.name)?.quantity || 0, () => { if (dessert.isAvailable) handleArrayOfObjectsChange(setSelectedDesserts, dessert.name, 1, quantity, options.dessertsA.map(d=>d.name)) }, () => handleArrayOfObjectsChange(setSelectedDesserts, dessert.name, -1, quantity, options.dessertsA.map(d=>d.name)) ))}</div></div><div className="p-4 bg-slate-100 rounded-lg"><h3 className="font-semibold text-slate-700 mb-3">{t.options.dessertB} <span className="text-sm font-normal text-slate-500">({t.options.selected} {dessertBCount} / {t.options.required} {quantity} {t.options.portion})</span></h3><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">{options.dessertsB.map(dessert => renderChoiceCounter(dessert, selectedDesserts.find(s => s.name === dessert.name)?.quantity || 0, () => { if (dessert.isAvailable) handleArrayOfObjectsChange(setSelectedDesserts, dessert.name, 1, quantity, options.dessertsB.map(d=>d.name)) }, () => handleArrayOfObjectsChange(setSelectedDesserts, dessert.name, -1, quantity, options.dessertsB.map(d=>d.name)) ))}</div></div></>}
                {custom.pastaChoice && <><div className="p-4 bg-slate-100 rounded-lg"><h3 className="font-semibold text-slate-700 mb-3">{t.options.pastaMain} <span className="text-sm font-normal text-slate-500">({t.options.selected} {pastaACount} / {t.options.required} {quantity} {t.options.portion})</span></h3><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">{options.pastasA.map(pasta => renderChoiceCounter(pasta, selectedPastas.find(s => s.name === pasta.name)?.quantity || 0, () => { if (pasta.isAvailable) handleArrayOfObjectsChange(setSelectedPastas, pasta.name, 1, quantity, options.pastasA.map(p=>p.name)) }, () => handleArrayOfObjectsChange(setSelectedPastas, pasta.name, -1, quantity, options.pastasA.map(p=>p.name)) ))}</div></div><div className="p-4 bg-slate-100 rounded-lg"><h3 className="font-semibold text-slate-700 mb-3">{t.options.pastaSauce} <span className="text-sm font-normal text-slate-500">({t.options.selected} {pastaBCount} / {t.options.required} {quantity} {t.options.portion})</span></h3><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">{options.pastasB.map(pasta => renderChoiceCounter(pasta, selectedPastas.find(s => s.name === pasta.name)?.quantity || 0, () => { if (pasta.isAvailable) handleArrayOfObjectsChange(setSelectedPastas, pasta.name, 1, quantity, options.pastasB.map(p=>p.name)) }, () => handleArrayOfObjectsChange(setSelectedPastas, pasta.name, -1, quantity, options.pastasB.map(p=>p.name)) ))}</div></div></>}
                {allAddons.filter(a => a.isAvailable).length > 0 && <div className="p-4 bg-slate-100 rounded-lg"><h3 className="font-semibold text-slate-700 mb-3">{t.options.addons}</h3><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">{allAddons.filter(a => a.isAvailable).map(addon => renderSimpleCounter(`${addon.name} (+$${addon.price})`, selectedAddons.find(a => a.id === addon.id)?.quantity || 0, () => handleAddonChange(addon, 1), () => handleAddonChange(addon, -1)))}</div></div>}
                {custom.notes && <div className="p-4 bg-slate-100 rounded-lg"><h3 className="font-semibold text-slate-700 mb-2">{t.options.notes}</h3><textarea value={selectedNotes} onChange={e => setSelectedNotes(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none" rows={3}></textarea></div>}
            </main>
            <footer className="p-5 border-t bg-slate-50 flex-shrink-0">
              <div className="max-w-4xl mx-auto flex justify-between items-center gap-4">
                <div className="flex items-center gap-3"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 rounded-full bg-slate-200 hover:bg-slate-300"><MinusIcon /></button><span className="font-bold text-xl w-10 text-center">{quantity}</span><button onClick={() => setQuantity(quantity + 1)} className="p-2 rounded-full bg-slate-200 hover:bg-slate-300"><PlusIcon /></button></div>
                {validationError && <p className="text-red-500 text-sm font-semibold flex-1 text-center">{validationError}</p>}
                <button onClick={handleConfirm} className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap text-lg">{editingItem ? `${t.updateItem} - $${totalPrice}` : `${t.addToCart} - $${totalPrice}`}</button>
              </div>
            </footer>
        </div>
    );
};