import React, { useState, useMemo, useEffect } from 'react';
import { CartItem, Order } from '../types';
import { CloseIcon, TrashIcon, MinusIcon, PlusIcon, CartIcon } from './Icons';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartId: string, newQuantity: number) => void;
  onRemoveItem: (cartId: string) => void;
  onEditItem: (cartId: string) => void;
  onSubmitAndPrint: (orderData: Partial<Order>) => void;
  isSubmitting: boolean;
  t: any;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onEditItem, onSubmitAndPrint, isSubmitting, t }) => {
    const [validationError, setValidationError] = useState<string | null>(null);
    
    useEffect(() => { if (!isOpen) setTimeout(() => setValidationError(null), 300); }, [isOpen]);
    
    const totalPrice = useMemo(() => cartItems.reduce((total, item) => total + item.totalPrice, 0), [cartItems]);
    
    const aggregatedOptions = useMemo(() => {
        const drinks: Record<string, number> = {}; 
        const sauces: Record<string, number> = {}; 
        const desserts: Record<string, number> = {}; 
        const pastas: Record<string, number> = {}; 
        const components: Record<string, number> = {}; 
        const sideChoices: Record<string, number> = {}; 
        const addons: Record<string, {quantity: number, price: number}> = {};
        
        cartItems.forEach(cartItem => {
            if (cartItem.selectedDrinks) Object.entries(cartItem.selectedDrinks).forEach(([name, quantity]) => drinks[name] = (drinks[name] || 0) + Number(quantity));
            if (cartItem.selectedSauces) (cartItem.selectedSauces).forEach(sauce => sauces[sauce.name] = (sauces[sauce.name] || 0) + sauce.quantity);
            if (cartItem.selectedDesserts) cartItem.selectedDesserts.forEach(dessert => desserts[dessert.name] = (desserts[dessert.name] || 0) + dessert.quantity);
            if (cartItem.selectedPastas) cartItem.selectedPastas.forEach(pasta => pastas[pasta.name] = (pastas[pasta.name] || 0) + pasta.quantity);
            if (cartItem.selectedComponent) Object.entries(cartItem.selectedComponent).forEach(([name, quantity]) => components[name] = (components[name] || 0) + Number(quantity));
            if (cartItem.selectedSideChoices) Object.entries(cartItem.selectedSideChoices).forEach(([name, quantity]) => sideChoices[name] = (sideChoices[name] || 0) + Number(quantity));
            if (cartItem.selectedAddons) cartItem.selectedAddons.forEach(addon => addons[addon.name] = { quantity: (addons[addon.name]?.quantity || 0) + addon.quantity, price: addon.price });
        });
        return { drinks, sauces, addons, desserts, pastas, components, sideChoices };
    }, [cartItems]);

    const handleCheckout = () => {
        setValidationError(null);
        if (cartItems.length === 0) { setValidationError(t.cartEmpty); return; }
        onSubmitAndPrint({ items: cartItems, totalPrice, customerInfo: { name: '現場顧客', phone: '', tableNumber: '' }, orderType: '外帶' });
    };

    return (
        <>
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-5 border-b"><h2 className="text-2xl font-bold text-slate-800">{t.cartTitle}</h2><button onClick={onClose} className="text-slate-500 hover:text-slate-800"><CloseIcon /></button></div>
                    {cartItems.length === 0 ? (<div className="flex-grow flex flex-col justify-center items-center text-slate-500 p-4"><CartIcon className="w-24 h-24 mb-4 text-slate-300"/><p className="text-lg">{t.cartEmpty}</p></div>) : (<>
                        <div className="flex-grow overflow-y-auto"><div className="p-5 space-y-6"><div className="bg-slate-50 rounded-lg p-4"><h3 className="text-lg font-bold text-slate-700 mb-3 pb-2 border-b">{t.content}</h3><div className="space-y-4">{cartItems.map((item, index) => (<div key={item.cartId} className="flex items-start gap-3"><div className="pt-1 font-semibold text-slate-500">{index + 1}.</div><div className="flex-grow"><button onClick={() => onEditItem(item.cartId)} className="font-semibold text-left hover:text-blue-600 hover:underline transition-colors focus:outline-none">{item.item.name.replace(/半全餐|半套餐/g, '套餐')} <span className="font-normal text-slate-500">(${item.item.price}) x{item.quantity}</span></button></div><div className="text-right flex flex-col items-end"><p className="font-bold text-lg">${item.totalPrice}</p><div className="flex items-center gap-2 mt-3"><button onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)} className="p-1 rounded-full bg-slate-200 hover:bg-slate-300"><MinusIcon className="h-4 w-4" /></button><span className="font-semibold w-8 text-center">{item.quantity}</span><button onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)} className="p-1 rounded-full bg-slate-200 hover:bg-slate-300"><PlusIcon className="h-4 w-4" /></button><button onClick={() => onRemoveItem(item.cartId)} className="text-red-500 hover:text-red-700 ml-1"><TrashIcon className="h-5 w-5"/></button></div></div></div>))}</div></div><div className="bg-slate-100 rounded-lg p-4"><h3 className="text-md font-bold text-slate-600 border-b pb-2 mb-3">訂單選項總覽</h3><dl className="text-sm text-slate-700 space-y-2">{Object.entries(aggregatedOptions).map(([key, value]) => { if (!value || Object.keys(value).length === 0) return null; const titleMap: any = { components: t.options.selected, drinks: t.options.drink, sideChoices: t.options.selected, sauces: t.options.sauce, desserts: t.options.dessertA, pastas: t.options.pastaMain, addons: t.options.addons }; const title = titleMap[key]; if (!title) return null; return (<div key={key}><dt className="font-semibold text-slate-500">{title}</dt><dd className="pl-2 mt-0.5 text-slate-800">{key === 'addons' ? (<ul className="list-disc list-inside">{Object.entries(value).map(([name, addonData]: any) => (<li key={name}>{name} (${addonData.price}) x{addonData.quantity}</li>))}</ul>) : Object.entries(value).map(([name, q]) => `${name} x${q}`).join('、')}</dd></div>); })}</dl></div></div></div>
                        <div className="p-5 border-t bg-slate-50"><div className="flex justify-between items-center mb-4"><span className="text-xl font-medium">{t.total}</span><span className="text-3xl font-bold text-green-700">${totalPrice}</span></div>{validationError && (<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-3 rounded-md text-left relative"><p className="font-bold pr-8">{validationError}</p><button onClick={() => setValidationError(null)} className="absolute top-1/2 right-2 -translate-y-1/2 p-1.5 text-red-500 hover:bg-red-200 rounded-lg transition-colors"><CloseIcon className="h-5 w-5" /></button></div>)}<button onClick={handleCheckout} disabled={isSubmitting} className="w-full bg-green-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-green-700 transition-colors text-lg flex justify-center items-center disabled:bg-slate-400 disabled:cursor-not-allowed">{isSubmitting ? t.processing : t.checkout}</button></div>
                    </>)}
                </div>
            </div>
        </>
    );
};