
import React, { useState, useEffect, useRef } from 'react';
import { apiService } from './services/apiService';
import { Menu } from './components/Menu';
import { Cart } from './components/Cart';
import { ItemModal } from './components/ItemModal';
import { AdminPanel } from './components/AdminPanel';
import { RefreshIcon, SearchIcon, CartIcon, CloseIcon, MinusIcon, PlusIcon } from './components/Icons';
import { TRANSLATIONS } from './constants';
import { MenuItem, MenuCategory, Addon, OptionsData, CartItem, Order, SearchOrderParams, OrderSummary } from './types';

// --- Small Helper Modals defined locally for simplicity ---

const OrderQueryModal = ({ isOpen, onClose, t }: { isOpen: boolean; onClose: () => void; t: any }) => {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [searchResult, setSearchResult] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchOrderParams>({ name: '', phone: '', startDate: '', endDate: '' });
  const [advancedResults, setAdvancedResults] = useState<OrderSummary[] | null>(null);
  
  useEffect(() => {
    if (!isOpen) { 
        setTimeout(() => { 
            setOrderIdInput(''); 
            setSearchResult(null); 
            setError(null); 
            setIsLoading(false); 
            setIsAdvancedSearch(false);
            setSearchParams({ name: '', phone: '', startDate: '', endDate: '' });
            setAdvancedResults(null);
        }, 300);
    }
  }, [isOpen]);

  const handleGetOrderDetails = async (id: string) => {
    if (!id) return; 
    setIsLoading(true); setError(null); setSearchResult(null);
    const result = await apiService.getOrder(id.trim());
    if (result.success && result.order) { 
        setSearchResult(result.order); 
        setOrderIdInput(id); 
    } else { 
        setError(result.message || '找不到此訂單，請確認訂單編號。'); 
    }
    setIsLoading(false);
  };

  const handleAdvancedSearch = async () => {
      setIsLoading(true); setError(null); setAdvancedResults(null);
      try {
          const result = await apiService.searchOrders(searchParams);
          if (result.success) {
              if (result.orders.length === 0) setError('找不到符合條件的訂單');
              else setAdvancedResults(result.orders);
          } else {
              setError('搜尋失敗，請稍後再試');
          }
      } catch (e) {
          setError('發生錯誤');
      }
      setIsLoading(false);
  };
  
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <header className="p-5 relative border-b"><button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"><CloseIcon /></button><h2 className="text-2xl font-bold text-slate-800">{t.orderQueryTitle}</h2></header>
            <main className="px-6 py-4 space-y-4 overflow-y-auto flex-1">
                {!isAdvancedSearch ? (
                    <>
                        <form onSubmit={(e) => { e.preventDefault(); handleGetOrderDetails(orderIdInput); }} className="flex gap-2"><input type="text" value={orderIdInput} onChange={(e) => setOrderIdInput(e.target.value)} placeholder={t.orderIdPlaceholder} className="flex-grow p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none" /><button type="submit" disabled={isLoading} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 flex items-center justify-center disabled:bg-slate-400">{isLoading ? '...' : <SearchIcon />}</button></form>
                        <div className="text-center mt-4">
                            <button onClick={() => setIsAdvancedSearch(true)} className="text-green-600 text-sm hover:underline">{t.advancedSearch} ↓</button>
                        </div>
                    </>
                ) : (
                    <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-slate-700">{t.advancedSearch}</h3>
                            <button onClick={() => setIsAdvancedSearch(false)} className="text-slate-500 text-xs hover:text-slate-700">{t.hideAdvancedSearch}</button>
                        </div>
                        <input type="text" placeholder={t.customerName} value={searchParams.name} onChange={e => setSearchParams({...searchParams, name: e.target.value})} className="w-full p-2 border rounded text-sm" />
                        <input type="tel" placeholder={t.customerPhone} value={searchParams.phone} onChange={e => setSearchParams({...searchParams, phone: e.target.value})} className="w-full p-2 border rounded text-sm" />
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>{t.dateRange}:</span>
                            <input type="date" value={searchParams.startDate} onChange={e => setSearchParams({...searchParams, startDate: e.target.value})} className="p-1 border rounded flex-1" />
                            <span>{t.to}</span>
                            <input type="date" value={searchParams.endDate} onChange={e => setSearchParams({...searchParams, endDate: e.target.value})} className="p-1 border rounded flex-1" />
                        </div>
                        <button onClick={handleAdvancedSearch} disabled={isLoading} className="w-full bg-slate-700 text-white py-2 rounded hover:bg-slate-800 disabled:opacity-50">{isLoading ? '...' : t.searchButton}</button>
                    </div>
                )}

                {error && <p className="text-red-500 text-center font-semibold py-2">{error}</p>}
                
                {advancedResults && (
                    <div className="border rounded-lg overflow-hidden mt-4">
                        <div className="bg-slate-100 px-3 py-2 font-bold text-sm text-slate-700">{t.searchResults} ({advancedResults.length})</div>
                        <div className="max-h-40 overflow-y-auto divide-y">
                            {advancedResults.map(order => (
                                <div key={order.id} onClick={() => handleGetOrderDetails(order.id)} className="p-3 hover:bg-slate-50 cursor-pointer flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-slate-800 text-sm">{order.customerName || 'Guest'}</div>
                                        <div className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-mono text-xs text-slate-400">{order.id.slice(-6)}</div>
                                        <div className="font-bold text-green-700 text-sm">${order.totalPrice}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {searchResult && (<div className="bg-slate-50 p-4 rounded-lg border space-y-2 mt-4"><h3 className="text-lg font-bold text-slate-800 text-center mb-3">{t.orderDetails}</h3><p className="font-mono font-bold text-slate-800 text-center">{searchResult.id}</p><p className="text-center text-green-700 font-bold">{searchResult.status}</p><p className="text-center text-sm">{new Date(searchResult.createdAt).toLocaleString()}</p><div className="border-t pt-2">{(searchResult.items || []).map((item, i) => (<p key={i} className="text-sm">{item.item.name} x{item.quantity}</p>))}</div></div>)}
            </main>
        </div>
    </div>
  );
};

const WelcomeModal = ({ onAgree, t }: { onAgree: () => void; t: any }) => {
    const brandingImage = "https://anonymousbeefsteak-cloud.github.io/pktry/5.jpg";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Branding Header */}
                <div className="relative h-48 w-full flex-shrink-0">
                    <img 
                        src={brandingImage} 
                        alt="Today's Menu Lazy Package" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                         <h2 className="text-2xl font-extrabold text-white drop-shadow-md">今日菜單懶人包</h2>
                         <p className="text-sm text-gray-200 drop-shadow-md opacity-90">點餐模擬頁面</p>
                    </div>
                </div>

                {/* Content & Rules */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                         <h3 className="text-lg font-bold text-slate-800 border-b-2 border-green-500 pb-2 mb-3">{t.welcomeTitle}</h3>
                         <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
                            {t.welcomeContent?.map((line: string, idx: number) => (
                                <p key={idx} className="flex items-start gap-2">
                                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                                    <span>{line.replace(/^＊/, '')}</span>
                                </p>
                            ))}
                         </div>
                    </div>

                    {/* Simulation Notice */}
                    <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 text-xs text-slate-500 mb-2">
                        <p className="font-bold mb-1 text-slate-700">💡 模擬點餐說明：</p>
                        <p>本頁面為線上模擬系統，僅供試算價格與預覽菜單。請於現場將最終畫面出示給服務人員。</p>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t bg-slate-50">
                    <button onClick={onAgree} className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-700 transition-all shadow-lg transform active:scale-95 text-lg">
                        {t.welcomeAgree}
                    </button>
                </div>
            </div>
        </div>
    );
};

const GuestCountModal = ({ onConfirm, t }: { onConfirm: (count: number) => void; t: any }) => {
    const [count, setCount] = useState(1);
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-xs" onClick={e => e.stopPropagation()}><div className="p-6 text-center"><h2 className="text-2xl font-bold text-slate-800 mb-4">{t.guestCountTitle}</h2><div className="flex items-center justify-center gap-4 my-6"><button onClick={() => setCount(c => Math.max(1, c - 1))} className="p-3 rounded-full bg-slate-200 hover:bg-slate-300"><MinusIcon className="h-6 w-6" /></button><input type="number" value={count} onChange={e => setCount(Math.max(1, parseInt(e.target.value, 10) || 1))} className="w-24 text-center text-4xl font-bold border-b-2 border-slate-300 focus:border-green-500 outline-none" min="1" /><button onClick={() => setCount(c => c + 1)} className="p-3 rounded-full bg-slate-200 hover:bg-slate-300"><PlusIcon className="h-6 w-6" /></button></div></div><footer className="px-6 pb-6"><button onClick={() => { if(count>0) onConfirm(count); }} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-lg">{t.guestCountConfirm}</button></footer></div>
        </div>
    );
};

const ThankYouModal = ({ onConfirm }: { onConfirm: () => void }) => {
    const [timeLeft, setTimeLeft] = useState(5);

    useEffect(() => {
        if (timeLeft === 0) {
            onConfirm();
            return;
        }
        const intervalId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft, onConfirm]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-[60] flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center transform transition-all scale-100 animate-bounce-in">
                <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">感謝您的試用</h2>
                <h3 className="text-lg font-medium text-slate-500 mb-6">Thank you for trying</h3>
                <p className="text-slate-600 mb-8">
                    模擬點餐程序已完成。<br/>
                    將在 <span className="font-bold text-green-600 text-xl">{timeLeft}</span> 秒後自動重新載入...
                </p>
                <button 
                    onClick={onConfirm}
                    className="w-full bg-slate-800 text-white font-bold py-3 px-6 rounded-xl hover:bg-slate-900 transition-colors shadow-md"
                >
                    立即重新載入 (Reload Now)
                </button>
            </div>
        </div>
    );
};

// --- Admin Login Modal to prevent native prompt breaking Fullscreen ---
const AdminLoginModal = ({ isOpen, onClose, onLogin }: { isOpen: boolean; onClose: () => void; onLogin: () => void }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "@Howardwang5172") {
            onLogin();
            setPassword('');
            setError('');
        } else {
            setError('密碼錯誤');
            setPassword('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[70] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-xs p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-slate-800 mb-4">管理後台登入</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)}
                            placeholder="請輸入管理員密碼"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            autoFocus
                        />
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium">取消</button>
                        <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">登入</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- Main App Component ---

const App = () => {
    const [language, setLanguage] = useState<'zh' | 'en'>('zh');
    const [menuData, setMenuData] = useState<MenuCategory[]>([]);
    const [addons, setAddons] = useState<Addon[]>([]);
    const [options, setOptions] = useState<OptionsData>({ sauces: [], dessertsA: [], dessertsB: [], pastasA: [], pastasB: [], coldNoodles: [], simpleMeals: [] });
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ item: MenuItem; category: string } | null>(null);
    const [editingItem, setEditingItem] = useState<CartItem | null>(null);
    const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);
    const [showGuestCountModal, setShowGuestCountModal] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    const [guestCount, setGuestCount] = useState(1);
    const [isQuietHours, setIsQuietHours] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    // Admin state
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
    
    const printContainerRef = useRef<HTMLElement | null>(null);
    const t = TRANSLATIONS[language];

    // --- INITIAL CLEAN URL (REMOVE FBCLID) ---
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            if (url.searchParams.has('fbclid')) {
                url.searchParams.delete('fbclid');
                window.history.replaceState({}, document.title, url.pathname + url.search);
            }
        }
    }, []);

    // --- ANTI-COPY & KIOSK PROTECTION ---
    useEffect(() => {
        // 1. Disable Context Menu (Right Click)
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        // 2. Disable Keyboard Shortcuts (Comprehensive)
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            // Allow typing in Inputs and Textareas
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                return;
            }
            // Block EVERYTHING else for "Kiosk" feel
            e.preventDefault();
            e.stopPropagation();
        };

        // 3. REMOVED DRAG START BLOCKER (This was causing mobile scrolling issues)
        // We rely on CSS "user-drag: none" instead.

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // --- EXIT LOGIC: ESC or Button ---
    const handleClosePage = () => {
        // If we are in Admin or Login, do not close page
        if (isAdminOpen || isAdminLoginOpen) return;

        try { window.close(); } catch (e) {}
        // Fallback for when window.close() is blocked by browser
        window.location.href = "about:blank";
    };

    // Helper to force FullScreen on Close Modal
    const ensureFullScreen = () => {
        const docEl = document.documentElement;
        if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
            if (docEl.requestFullscreen) {
                docEl.requestFullscreen().catch(() => {});
            } else if ((docEl as any).webkitRequestFullscreen) {
                (docEl as any).webkitRequestFullscreen();
            }
        }
    };

    // Listen for Fullscreen Changes to handle ESC key
    useEffect(() => {
        const onFullScreenChange = () => {
            const isFullScreen = document.fullscreenElement || (document as any).webkitFullscreenElement;
            
            // If full screen is exited AND we are inside the app (not on welcome screen), close/leave the page.
            // Added check: Don't close if:
            // 1. Admin login is open
            // 2. Admin panel is open
            // 3. Item Modal is open (selectedItem !== null) - Allows ESC to close modal without killing app
            // 4. Cart is open (isCartOpen)
            if (!isFullScreen && !showWelcome && !isAdminLoginOpen && !isAdminOpen && !selectedItem && !isCartOpen) {
                handleClosePage();
            }
        };
        
        document.addEventListener('fullscreenchange', onFullScreenChange);
        document.addEventListener('webkitfullscreenchange', onFullScreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', onFullScreenChange);
            document.removeEventListener('webkitfullscreenchange', onFullScreenChange);
        };
    }, [showWelcome, isAdminLoginOpen, isAdminOpen, selectedItem, isCartOpen]);

    useEffect(() => {
        printContainerRef.current = document.getElementById('print-container');
        
        // STRICT PRIVACY: Ensure legacy/temp 'recent orders' are wiped on every load.
        localStorage.removeItem('steakhouse-recent-orders');
        
        // If Welcome Screen is showing (New Session), clear the cart completely.
        if (showWelcome) {
            localStorage.removeItem('steakhouse_cart');
            setCartItems([]);
        } else {
            const storedCart = localStorage.getItem('steakhouse_cart');
            if (storedCart) { try { setCartItems(JSON.parse(storedCart)); } catch (e) { localStorage.removeItem('steakhouse_cart'); } }
        }
        
        fetchData();
    }, [isAdminOpen, language, showWelcome]); 

    // Strict Privacy: Only save to local storage if we are past the welcome screen
    useEffect(() => { 
        if (!showWelcome) {
            localStorage.setItem('steakhouse_cart', JSON.stringify(cartItems)); 
        }
    }, [cartItems, showWelcome]);

    const fetchData = async () => {
        setIsLoading(true);
        try { 
            const { menu, addons, options, isQuietHours } = await apiService.getMenuAndAddons(language); 
            setMenuData(menu); 
            setAddons(addons); 
            setOptions(options); 
            setIsQuietHours(isQuietHours); 
        } catch (error) { 
            console.error("Failed to fetch data:", error); 
        } finally { 
            setIsLoading(false); 
        }
    };

    const handleSelectItem = (item: MenuItem, category: MenuCategory) => { setSelectedItem({ item, category: category.title }); setEditingItem(null); };
    const handleEditItem = (cartId: string) => { 
        const itemToEdit = cartItems.find(item => item.cartId === cartId); 
        if (itemToEdit) { 
            setSelectedItem({ item: itemToEdit.item, category: itemToEdit.categoryTitle }); 
            setEditingItem(itemToEdit); 
            setIsCartOpen(false); 
        } 
    };
    const handleCloseModal = () => { 
        setSelectedItem(null); 
        setEditingItem(null); 
        // When modal closes, force full screen again to maintain Kiosk mode
        ensureFullScreen();
    };

    const handleCartClose = () => {
        setIsCartOpen(false);
        ensureFullScreen();
    };

    const handleConfirmSelection = (item: MenuItem, quantity: number, selections: any, categoryTitle: string) => {
        const createCartKey = (itemData: MenuItem, selectionData: any) => [
            itemData.id, 
            JSON.stringify(selectionData.donenesses), 
            JSON.stringify(selectionData.componentChoices), 
            JSON.stringify(selectionData.multiChoice), 
            JSON.stringify(selectionData.sideChoices), 
            JSON.stringify(selectionData.singleChoiceAddon), 
            JSON.stringify(selectionData.notes), 
            JSON.stringify((selectionData.sauces || []).map((s: any) => `${s.name}x${s.quantity}`).sort()), 
            JSON.stringify(Object.entries(selectionData.drinks || {}).sort()), 
            JSON.stringify((selectionData.desserts || []).map((s: any) => `${s.name}x${s.quantity}`).sort()), 
            JSON.stringify((selectionData.pastas || []).map((s: any) => `${s.name}x${s.quantity}`).sort()), 
            JSON.stringify((selectionData.addons || []).map((a: any) => `${a.id}x${a.quantity}`).sort())
        ].join('|');
        
        const cartKey = createCartKey(item, selections);
        const totalPrice = (item.price * quantity) + (selections.addons || []).reduce((sum: number, addon: any) => sum + addon.price * addon.quantity, 0);

        const newCartItem: CartItem = { 
            cartId: editingItem ? editingItem.cartId : `${Date.now()}-${Math.random()}`, 
            cartKey, 
            item, 
            quantity, 
            categoryTitle, 
            selectedDonenesses: selections.donenesses, 
            selectedDrinks: selections.drinks, 
            selectedAddons: selections.addons, 
            selectedSauces: selections.sauces, 
            selectedDesserts: selections.desserts, 
            selectedPastas: selections.pastas, 
            selectedComponent: selections.componentChoices, 
            selectedSideChoices: selections.sideChoices, 
            selectedMultiChoice: selections.multiChoice, 
            selectedSingleChoiceAddon: selections.singleChoiceAddon, 
            selectedNotes: selections.notes, 
            totalPrice 
        };
        
        if (editingItem) { 
            setCartItems(prev => prev.map(ci => ci.cartId === editingItem.cartId ? newCartItem : ci)); 
        } else { 
            setCartItems(prev => { 
                const existingItem = prev.find(ci => ci.cartKey === cartKey); 
                if (existingItem) return prev.map(ci => ci.cartKey === cartKey ? { ...ci, quantity: ci.quantity + quantity, totalPrice: ci.totalPrice + totalPrice } : ci); 
                return [...prev, newCartItem]; 
            }); 
        }
        handleCloseModal();
    };

    const handleUpdateQuantity = (cartId: string, newQuantity: number) => {
        setCartItems(prev => {
          if (newQuantity <= 0) return prev.filter(item => item.cartId !== cartId);
          return prev.map(item => {
            if (item.cartId !== cartId) return item;
            const oldQuantity = item.quantity; if (oldQuantity === newQuantity) return item;
            const scale = newQuantity / oldQuantity;
            
            const scaleAndAdjust = (obj: any, targetTotal: number) => {
              if (!obj || Object.keys(obj).length === 0) return obj;
              const scaled = Object.entries(obj).map(([key, value]) => ({ key, value: (value as number) * scale }));
              const rounded = scaled.map(pair => ({ ...pair, value: Math.round(pair.value) }));
              let currentTotal = rounded.reduce((sum, pair) => sum + pair.value, 0);
              let diff = targetTotal - currentTotal;
              while (diff !== 0) {
                const errors = scaled.map((s, i) => ({ index: i, error: s.value - rounded[i].value }));
                if (diff > 0) { errors.sort((a, b) => b.error - a.error); rounded[errors[0].index].value++; diff--; } 
                else { errors.sort((a, b) => a.error - b.error); const targetIndex = errors.findIndex(e => rounded[e.index].value > 0); if (targetIndex !== -1) rounded[errors[targetIndex].index].value--; else break; diff++; }
              }
              return Object.fromEntries(rounded.filter(pair => pair.value > 0).map(pair => [pair.key, pair.value]));
            };
            const scaleArrayQuantities = (arr: any[]) => { if (!arr || arr.length === 0) return arr; return arr.map(subItem => ({ ...subItem, quantity: Math.max(1, Math.round(subItem.quantity * scale)) })).filter(si => si.quantity > 0); };
            const custom = item.item.customizations;
            return { 
                ...item, 
                quantity: newQuantity, 
                totalPrice: (item.totalPrice / oldQuantity) * newQuantity, 
                selectedDonenesses: custom.doneness ? scaleAndAdjust(item.selectedDonenesses, newQuantity) : item.selectedDonenesses, 
                selectedDrinks: custom.drinkChoice ? scaleAndAdjust(item.selectedDrinks, newQuantity) : item.selectedDrinks, 
                selectedComponent: custom.componentChoice ? scaleAndAdjust(item.selectedComponent, newQuantity) : item.selectedComponent, 
                selectedMultiChoice: custom.multiChoice ? scaleAndAdjust(item.selectedMultiChoice, newQuantity) : item.selectedMultiChoice, 
                selectedSideChoices: custom.sideChoice ? scaleAndAdjust(item.selectedSideChoices, custom.sideChoice.choices * newQuantity) : item.selectedSideChoices, 
                selectedSauces: scaleArrayQuantities(item.selectedSauces), 
                selectedDesserts: scaleArrayQuantities(item.selectedDesserts), 
                selectedPastas: scaleArrayQuantities(item.selectedPastas), 
                selectedAddons: scaleArrayQuantities(item.selectedAddons) 
            };
          });
        });
    };

    const handleRemoveItem = (cartId: string) => setCartItems(prev => prev.filter(item => item.cartId !== cartId));
    
    const handleWelcomeAgree = () => { 
        // Ensure we start fresh when user agrees
        localStorage.removeItem('steakhouse_cart');
        setCartItems([]);
        setShowWelcome(false); 
        setShowGuestCountModal(true);
        
        // TRIGGER FULL SCREEN
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
            docEl.requestFullscreen().catch(err => console.log("Fullscreen denied:", err));
        } else if ((docEl as any).webkitRequestFullscreen) {
            (docEl as any).webkitRequestFullscreen();
        }
    };

    const handleExitFullScreen = () => {
        // Explicit Close Button Action
        if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
            if (document.exitFullscreen) {
                // Trigger exit, the useEffect will catch the event and close the page
                document.exitFullscreen().catch(() => handleClosePage());
            } else if ((document as any).webkitExitFullscreen) {
                (document as any).webkitExitFullscreen();
            }
        } else {
            // Not in full screen, just close
            handleClosePage();
        }
    };
    
    const handleGuestCountConfirm = (count: number) => { setGuestCount(count); setShowGuestCountModal(false); };
    
    const handleThankYouConfirm = () => {
        // Soft Reset to maintain Full Screen and URL parameters (Facebook Link Shim)
        setCartItems([]);
        localStorage.removeItem('steakhouse_cart');
        setGuestCount(1);
        setLanguage('zh');
        setIsCartOpen(false);
        setSelectedItem(null);
        setEditingItem(null);
        setIsQueryModalOpen(false);
        setIsSubmitting(false);
        
        setShowThankYou(false);
        setShowWelcome(true); // Back to Start
        
        // Ensure Full Screen is active
        ensureFullScreen();
    };

    const handleSubmitAndPrint = async (orderData: Partial<Order>) => {
        if (isSubmitting) return; setIsSubmitting(true);
        try {
            const finalOrderData = { ...orderData, guestCount };
            // Simulate submission
            const result = await apiService.submitOrder(finalOrderData);
            if (result.success && result.order) { 
                // SKIP PRINTING logic, go straight to cleanup
                setCartItems([]); 
                localStorage.removeItem('steakhouse_cart'); 
                setIsCartOpen(false); 
                setIsSubmitting(false); 
                setShowThankYou(true);
            } else { 
                alert((!result.success && result.message) || 'Order failed.'); 
                setIsSubmitting(false); 
            }
        } catch (error: any) { 
            alert(`Error: ${error.message}`); 
            setIsSubmitting(false); 
        }
    };

    const handleNavigateToAdmin = () => { 
        // Use custom modal instead of window.prompt to prevent exiting full screen
        setIsAdminLoginOpen(true);
    };
    
    const handleAdminLoginSuccess = () => {
        setIsAdminLoginOpen(false);
        setIsAdminOpen(true);
    };
    
    const toggleLanguage = () => { 
        setLanguage(prev => prev === 'zh' ? 'en' : 'zh'); 
        setCartItems([]); setIsCartOpen(false); 
    };
    
    const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    if (isAdminOpen) return <AdminPanel onBack={() => setIsAdminOpen(false)} />;
    if (showWelcome) return <WelcomeModal onAgree={handleWelcomeAgree} t={t} />;
    if (showGuestCountModal) return <GuestCountModal onConfirm={handleGuestCountConfirm} t={t} />;
    if (showThankYou) return <ThankYouModal onConfirm={handleThankYouConfirm} />;

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden relative bg-slate-100">
            {/* EXIT FULL SCREEN BUTTON (Visible in Kiosk Mode) */}
            <button 
                onClick={handleExitFullScreen}
                className="fixed top-0 right-0 z-[100] bg-black/30 hover:bg-red-600 text-white p-3 rounded-bl-xl transition-colors no-print"
                title="Exit Full Screen / Close Page"
            >
                <CloseIcon className="w-6 h-6" />
            </button>

          <aside className="no-print w-64 bg-white shadow-lg fixed top-0 left-0 h-full overflow-y-auto hidden lg:block z-20">
            <div className="p-6"><h1 className="text-2xl font-bold text-green-700 cursor-pointer select-none" onDoubleClick={handleNavigateToAdmin} title="雙擊進入管理後台">{t.title}</h1></div>
            <nav className="mt-4"><ul>{menuData.map((category) => (<li key={category.title}><a href={`#${category.title}`} className="block px-6 py-3 text-slate-600 font-semibold hover:bg-slate-100 hover:text-green-700 transition-colors">{category.title}</a></li>))}</ul></nav>
          </aside>
          
          <main className="flex-1 flex flex-col h-full relative lg:ml-64 overflow-hidden">
            <header className="no-print bg-white/80 backdrop-blur-sm p-4 shadow-md z-20 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-4"><h1 className="text-xl font-bold text-green-700 lg:hidden cursor-pointer select-none" onDoubleClick={handleNavigateToAdmin}>{t.title}</h1><button onClick={toggleLanguage} className="text-sm font-bold text-slate-600 border border-slate-300 rounded px-3 py-1 hover:bg-slate-100">{language === 'zh' ? 'English' : '中文'}</button></div>
                <div className="flex items-center gap-3"><button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"><RefreshIcon className="h-5 w-5"/><span className="hidden sm:inline">{t.refresh}</span></button><button onClick={() => setIsQueryModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"><SearchIcon /><span className="hidden sm:inline">{t.searchOrder}</span></button></div>
            </header>
            
            {isQuietHours ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4"><h2 className="text-3xl font-bold text-slate-700 mb-4">{t.shopClosed}</h2><p className="text-slate-500">{t.shopClosedDesc}</p></div>
            ) : isLoading ? (
              <div className="flex items-center justify-center h-full"><p className="text-slate-500">{t.loading}</p></div>
            ) : (
              <div className="flex-1 overflow-y-auto scroll-smooth p-6 lg:p-10 pb-40">
                  <Menu menuData={menuData} onSelectItem={handleSelectItem} t={t} />
              </div>
            )}
          </main>
          
          {!isQuietHours && (<div className="fixed bottom-6 right-6 z-30 no-print"><button onClick={() => setIsCartOpen(true)} className="bg-green-600 text-white rounded-full shadow-lg p-4 hover:bg-green-700 transition-transform transform hover:scale-110"><CartIcon className="h-8 w-8" />{totalCartItems > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">{totalCartItems}</span>}</button></div>)}
          
          {selectedItem && (<ItemModal selectedItem={selectedItem} editingItem={editingItem} addons={addons} options={options} onClose={handleCloseModal} onConfirmSelection={handleConfirmSelection} t={t} />)}
          <Cart isOpen={isCartOpen} onClose={handleCartClose} cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} onEditItem={handleEditItem} onSubmitAndPrint={handleSubmitAndPrint} isSubmitting={isSubmitting} t={t} />
          <OrderQueryModal isOpen={isQueryModalOpen} onClose={() => setIsQueryModalOpen(false)} t={t} />
          <AdminLoginModal isOpen={isAdminLoginOpen} onClose={() => setIsAdminLoginOpen(false)} onLogin={handleAdminLoginSuccess} />
        </div>
    );
};

export default App;
