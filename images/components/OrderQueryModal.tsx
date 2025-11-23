import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { CloseIcon, SearchIcon } from './Icons';
import { Order } from '../types';

interface OrderQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: any;
}

const OrderQueryModal: React.FC<OrderQueryModalProps> = ({ isOpen, onClose, t }) => {
  const [orderIdInput, setOrderIdInput] = useState(''); 
  const [searchResult, setSearchResult] = useState<Order | null>(null); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  const [recentOrders, setRecentOrders] = useState<string[]>([]); 
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false); 
  const [advSearchParams, setAdvSearchParams] = useState({ name: '', phone: '', startDate: '', endDate: '' }); 
  const [advSearchResults, setAdvSearchResults] = useState<any[]>([]); 
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => { 
    if (isOpen) setRecentOrders(JSON.parse(localStorage.getItem('steakhouse-recent-orders') || '[]')); 
    else setTimeout(() => { setOrderIdInput(''); setSearchResult(null); setError(null); setIsLoading(false); setIsAdvancedSearchOpen(false); setAdvSearchParams({ name: '', phone: '', startDate: '', endDate: '' }); setAdvSearchResults([]); setIsSearching(false); }, 300); 
  }, [isOpen]);

  const handleGetOrderDetails = async (id: string) => { 
    if (!id) return; 
    setIsLoading(true); 
    setError(null); 
    setSearchResult(null); 
    setAdvSearchResults([]); 
    const result = await apiService.getOrder(id.trim()); 
    if (result.success && 'order' in result) { 
      setSearchResult(result.order); 
      setOrderIdInput(id); 
    } else { 
      const msg = 'message' in result ? result.message : '找不到此訂單，請確認訂單編號。';
      setError(msg); 
    } 
    setIsLoading(false); 
  };

  const handleAdvancedSearch = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    setIsSearching(true); 
    setError(null); 
    setSearchResult(null); 
    setOrderIdInput(''); 
    const result = await apiService.searchOrders(advSearchParams); 
    if (result.success && result.orders) { 
      setAdvSearchResults(result.orders); 
      if (result.orders.length === 0) setError("找不到符合條件的訂單。"); 
    } else { 
      setAdvSearchResults([]); 
      setError((result as any).message || "搜尋時發生錯誤。"); 
    } 
    setIsSearching(false); 
  }

  const renderOrderItem = (item: any, index: number) => ( <div key={item.cartId || index} className="py-2 border-b border-slate-200"> <p className="font-semibold text-slate-800">{item.item.name.replace(/半全餐|半套餐/g, '套餐')} (${item.item.price}) <span className="font-normal">x{item.quantity}</span></p> <div className="text-xs text-slate-500 pl-2"> {item.selectedDonenesses && Object.keys(item.selectedDonenesses).length > 0 && <p>{t.options.doneness}: {Object.entries(item.selectedDonenesses).map(([d, q]) => `${d}x${q}`).join(', ')}</p>} {item.selectedComponent && Object.keys(item.selectedComponent).length > 0 && <p>{t.options.selected}: {Object.entries(item.selectedComponent).map(([c, q]) => `${c}x${q}`).join(', ')}</p>} {item.selectedSideChoices && Object.keys(item.selectedSideChoices).length > 0 && <p>{t.options.selected}: {Object.entries(item.selectedSideChoices).map(([d, q]) => `${d}x${q}`).join(', ')}</p>} {item.selectedDrinks && Object.keys(item.selectedDrinks).length > 0 && <p>{t.options.drink}: {Object.entries(item.selectedDrinks).map(([d, q]) => `${d}x${q}`).join(', ')}</p>} {item.selectedSauces && item.selectedSauces.length > 0 && <p>{t.options.sauce}: {item.selectedSauces.map((s: any) => `${s.name}x${s.quantity}`).join(', ')}</p>} {item.selectedPastas && item.selectedPastas.length > 0 && <p>{t.options.pastaMain}: {item.selectedPastas.map((p: any) => `${p.name}x${p.quantity}`).join(', ')}</p>} {item.selectedAddons && item.selectedAddons.length > 0 && <p>{t.options.addons}: {item.selectedAddons.map((a: any) => `${a.name} ($${a.price}) x${a.quantity}`).join(', ')}</p>} {item.selectedNotes && <p>{t.options.notes}: {item.selectedNotes}</p>} </div> </div> );
  return ( <div className={`fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}> <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}> <header className="p-5 relative border-b"><button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"><CloseIcon /></button><h2 className="text-2xl font-bold text-slate-800">{t.orderQueryTitle}</h2></header> <main className="px-6 py-4 space-y-4 overflow-y-auto"> <form onSubmit={(e) => { e.preventDefault(); handleGetOrderDetails(orderIdInput); }} className="flex gap-2"><input type="text" value={orderIdInput} onChange={(e) => setOrderIdInput(e.target.value)} placeholder={t.orderIdPlaceholder} className="flex-grow p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none" /><button type="submit" disabled={isLoading} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 flex items-center justify-center disabled:bg-slate-400">{isLoading && !isSearching ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : <SearchIcon />}</button></form> {recentOrders.length > 0 && (<div className="text-sm"><h3 className="font-semibold text-slate-500 mb-2">{t.recentOrders}:</h3><div className="flex flex-wrap gap-2">{recentOrders.map(id => (<button key={id} onClick={() => handleGetOrderDetails(id)} className="bg-slate-100 text-slate-700 font-mono px-3 py-1 rounded-full hover:bg-slate-200">{id}</button>))}</div></div>)} <div className="text-center"><button onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)} className="text-sm text-blue-600 hover:underline">{isAdvancedSearchOpen ? t.hideAdvancedSearch : t.advancedSearch}</button></div> {isAdvancedSearchOpen && ( <form onSubmit={handleAdvancedSearch} className="p-4 bg-slate-50 rounded-lg border space-y-3"><h3 className="font-semibold text-slate-700">{t.advancedSearch}</h3><input type="text" value={advSearchParams.name} onChange={e => setAdvSearchParams(p => ({...p, name: e.target.value}))} placeholder={t.customerName} className="w-full p-2 border rounded" /><input type="tel" value={advSearchParams.phone} onChange={e => { const numericValue = e.target.value.replace(/[^0-9]/g, ''); if (numericValue.length <= 10) { setAdvSearchParams(p => ({...p, phone: numericValue})); } }} placeholder={t.customerPhone} className="w-full p-2 border rounded" maxLength={10} /><div className="flex gap-2 items-center"><label className="text-sm">{t.dateRange}:</label><input type="date" value={advSearchParams.startDate} onChange={e => setAdvSearchParams(p => ({...p, startDate: e.target.value}))} className="w-full p-2 border rounded" /><span className="text-sm">{t.to}</span><input type="date" value={advSearchParams.endDate} onChange={e => setAdvSearchParams(p => ({...p, endDate: e.target.value}))} className="w-full p-2 border rounded" /></div><button type="submit" disabled={isSearching} className="w-full mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 flex items-center justify-center disabled:bg-slate-400">{isSearching ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : t.executeSearch}</button></form> )} {advSearchResults.length > 0 && ( <div className="border-t pt-4 mt-4"><h3 className="font-semibold text-slate-800 mb-2">{t.searchResults}:</h3><ul className="max-h-48 overflow-y-auto bg-white border rounded-lg divide-y">{advSearchResults.map(order => (<li key={order.id}><button onClick={() => handleGetOrderDetails(order.id)} className="w-full text-left p-3 hover:bg-slate-100"><div className="flex justify-between font-mono text-sm"><span>{order.id}</span><span>${order.totalAmount}</span></div><div className="text-xs text-slate-500">{order.customerName} - {new Date(order.timestamp).toLocaleDateString()}</div></button></li>))}</ul></div> )} {error && <p className="text-red-500 text-center font-semibold py-2">{error}</p>} {searchResult && (<div className="bg-slate-50 p-4 rounded-lg border space-y-2 mt-4 animate-fade-in"><h3 className="text-lg font-bold text-slate-800 text-center mb-3">{t.orderDetails}</h3><div className="flex justify-between items-baseline"><p className="text-sm text-slate-600">{t.orderId}:</p><p className="font-mono font-bold text-slate-800">{searchResult.id}</p></div><div className="flex justify-between items-baseline"><p className="text-sm text-slate-600">{t.customer}:</p><p className="font-semibold">{searchResult.customerInfo.name} ({searchResult.customerInfo.phone})</p></div><div className="flex justify-between items-baseline"><p className="text-sm text-slate-600">{t.type}:</p><p className="font-semibold">{searchResult.orderType}{searchResult.orderType === '內用' && searchResult.customerInfo.tableNumber ? ` (${searchResult.customerInfo.tableNumber})`: ''}</p></div><div className="flex justify-between items-baseline"><p className="text-sm text-slate-600">{t.status}:</p><p className="font-semibold text-green-700">{searchResult.status}</p></div><div className="flex justify-between items-baseline"><p className="text-sm text-slate-600">{t.time}:</p><p className="font-semibold text-sm">{new Date(searchResult.createdAt).toLocaleString()}</p></div><div className="border-t border-slate-300 pt-2 mt-2"><h4 className="text-base font-bold text-slate-700 mb-2">{t.content}</h4>{(searchResult.items || []).map(renderOrderItem)}</div><div className="flex justify-between items-center border-t border-slate-300 pt-2 mt-3"><p className="text-lg font-bold">{t.total}:</p><p className="text-xl font-bold text-green-700">${searchResult.totalPrice}</p></div></div>)} </main> </div> </div> );
};

export default OrderQueryModal;