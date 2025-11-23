
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { apiService, initializeLocalStorage } from './services/apiService';
import { TRANSLATIONS } from './constants';
import { MenuCategory, MenuItem, OptionsData, CartItem, Order } from './types';
import { CartIcon, RefreshIcon, SearchIcon } from './components/Icons';
import Menu from './components/Menu';
import ItemModal from './components/ItemModal';
import Cart from './components/Cart';
import OrderQueryModal from './components/OrderQueryModal';
import PrintableOrder from './components/PrintableOrder';
import AdminPanel from './components/AdminPanel';
import WelcomeModal from './components/WelcomeModal';
import GuestCountModal from './components/GuestCountModal';

const App: React.FC = () => {
    const [language, setLanguage] = useState<'zh' | 'en'>('zh');
    const [menuData, setMenuData] = useState<MenuCategory[]>([]);
    const [addons, setAddons] = useState<MenuItem[]>([]);
    const [options, setOptions] = useState<OptionsData>({ sauces: [], dessertsA: [], dessertsB: [], pastasA: [], pastasB: [], coldNoodles: [], simpleMeals: [] });
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ item: MenuItem; category: string } | null>(null);
    const [editingItem, setEditingItem] = useState<CartItem | null>(null);
    const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);
    const [showGuestCountModal, setShowGuestCountModal] = useState(false);
    const [guestCount, setGuestCount] = useState(1);
    const [isQuietHours, setIsQuietHours] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [orderToPrint, setOrderToPrint] = useState<Order | null>(null);
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    
    const printContainerRef = useRef<HTMLElement | null>(null);
    const handleSoftReloadRef = useRef<() => void>(() => {});

    const t = TRANSLATIONS[language];

    // Helper to force fullscreen with vendor prefixes
    const enterFullscreen = () => {
        const doc = document.documentElement as any;
        if (doc.requestFullscreen) {
            doc.requestFullscreen().catch((err: any) => console.log('Fullscreen request failed or denied:', err));
        } else if (doc.webkitRequestFullscreen) {
            doc.webkitRequestFullscreen();
        } else if (doc.msRequestFullscreen) {
            doc.msRequestFullscreen();
        }
    };

    // Soft Reload: Resets app state without browser reload to keep fullscreen
    const handleSoftReload = () => {
        setCartItems([]);
        setIsCartOpen(false);
        setSelectedItem(null);
        setEditingItem(null);
        setIsQueryModalOpen(false);
        setIsSubmitting(false);
        setShowWelcome(true);
        setShowGuestCountModal(false);
        setGuestCount(1);
        setOrderToPrint(null);
        setIsAdminOpen(false);
        // We keep the language setting
        fetchData();
        // Force fullscreen re-entry attempt on reload
        enterFullscreen();
    };

    // Keep ref updated for the event listener
    useEffect(() => {
        handleSoftReloadRef.current = handleSoftReload;
    });

    useEffect(() => {
        initializeLocalStorage();
        console.log("提示: 雙擊頁面標題「無名牛排」並輸入密碼即可進入管理後台。");
        printContainerRef.current = document.getElementById('print-container');
        const storedCart = localStorage.getItem('steakhouse_cart');
        if (storedCart) { try { setCartItems(JSON.parse(storedCart)); } catch (e) { localStorage.removeItem('steakhouse_cart'); } }
        fetchData();

        // Kiosk Mode Strict Protections
        const preventDefault = (e: Event) => e.preventDefault();
        
        // 1. Disable Right Click / Context Menu
        document.addEventListener('contextmenu', preventDefault);
        
        // 2. Disable Dragging (Images/Text)
        document.addEventListener('dragstart', preventDefault);

        // 3. Disable Key Combinations
        const handleKeyDown = (e: KeyboardEvent) => {
            // Handle Escape: Close all modals and FORCE FULLSCREEN (Strict Kiosk)
            // Use highest priority check with stopImmediatePropagation
            if (e.key === 'Escape') {
                e.preventDefault(); // Stop browser exit or other default actions
                e.stopPropagation(); // Stop event bubbling
                e.stopImmediatePropagation(); // Stop other listeners
                
                // Blur any active input to hide virtual keyboard immediately
                (document.activeElement as HTMLElement)?.blur();
                
                // Close ANY open modal or view to return to main menu
                setIsCartOpen(false);
                setSelectedItem(null);
                setEditingItem(null);
                setIsQueryModalOpen(false);
                setIsAdminOpen(false);
                setShowGuestCountModal(false);
                
                // Re-enforce fullscreen immediately
                enterFullscreen();
                return;
            }

            // Prevent F5 and Ctrl+R (Standard Reload) and redirect to Soft Reload
            if (e.key === 'F5' || (e.ctrlKey && (e.key === 'r' || e.key === 'R'))) {
                e.preventDefault();
                console.log("Soft Reload Triggered via Keyboard");
                handleSoftReloadRef.current();
                return;
            }
            
            // Prevent Developer Tools (F12, Ctrl+Shift+I/J/C, Ctrl+U)
            if (
                e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
                (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
            ) {
                e.preventDefault();
                return;
            }

            // Prevent Navigation (Alt+Left, Alt+Right)
            if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
                e.preventDefault();
                return;
            }

            // Prevent Print Dialog (Ctrl+P) - App handles printing internally
            if (e.ctrlKey && (e.key === 'p' || e.key === 'P')) {
                e.preventDefault();
                return;
            }
        };
        
        // Use capture phase to ensure we catch ESC before inputs/modals
        window.addEventListener('keydown', handleKeyDown, { capture: true });

        return () => {
            document.removeEventListener('contextmenu', preventDefault);
            document.removeEventListener('dragstart', preventDefault);
            window.removeEventListener('keydown', handleKeyDown, { capture: true });
        };
    }, []); // Run once on mount

    useEffect(() => { 
        // Re-fetch when admin panel closes or language changes
        fetchData(); 
    }, [isAdminOpen, language]); 

    useEffect(() => { localStorage.setItem('steakhouse_cart', JSON.stringify(cartItems)); }, [cartItems]);

    const fetchData = async () => {
        setIsLoading(true);
        try { const { menu, addons, options, isQuietHours } = await apiService.getMenuAndAddons(language); setMenuData(menu); setAddons(addons); setOptions(options); setIsQuietHours(isQuietHours); } 
        catch (error) { console.error("Failed to fetch data:", error); } 
        finally { setIsLoading(false); }
    };

    const handleSelectItem = (item: MenuItem, category: MenuCategory) => { setSelectedItem({ item, category: category.title }); setEditingItem(null); };
    const handleEditItem = (cartId: string) => { const itemToEdit = cartItems.find(item => item.cartId === cartId); if (itemToEdit && itemToEdit.categoryTitle) { setSelectedItem({ item: itemToEdit.item, category: itemToEdit.categoryTitle }); setEditingItem(itemToEdit); setIsCartOpen(false); } };
    
    // STRICT KIOSK: Handle closing Item Modal (pressing X)
    const handleCloseModal = () => { 
        setSelectedItem(null); 
        setEditingItem(null); 
        // Force fullscreen re-entry when closing modal to ensure Kiosk experience
        enterFullscreen();
    };

    const handleConfirmSelection = (item: MenuItem, quantity: number, selections: any, categoryTitle: string) => {
        const createCartKey = (itemData: MenuItem, selectionData: any) => [itemData.id, JSON.stringify(selectionData.donenesses), JSON.stringify(selectionData.componentChoices), JSON.stringify(selectionData.multiChoice), JSON.stringify(selectionData.sideChoices), JSON.stringify(selectionData.singleChoiceAddon), JSON.stringify(selectionData.notes), JSON.stringify((selectionData.sauces || []).map((s:any) => `${s.name}x${s.quantity}`).sort()), JSON.stringify(Object.entries(selectionData.drinks || {}).sort()), JSON.stringify((selectionData.desserts || []).map((s:any) => `${s.name}x${s.quantity}`).sort()), JSON.stringify((selectionData.pastas || []).map((s:any) => `${s.name}x${s.quantity}`).sort()), JSON.stringify((selectionData.addons || []).map((a:any) => `${a.id}x${a.quantity}`).sort())].join('|');
        const cartKey = createCartKey(item, selections);
        const totalPrice = (item.price * quantity) + (selections.addons || []).reduce((sum: number, addon: any) => sum + addon.price * addon.quantity, 0);

        const newCartItem: CartItem = { cartId: editingItem ? editingItem.cartId : `${Date.now()}-${Math.random()}`, cartKey, item, quantity, categoryTitle, selectedDonenesses: selections.donenesses, selectedDrinks: selections.drinks, selectedAddons: selections.addons, selectedSauces: selections.sauces, selectedDesserts: selections.desserts, selectedPastas: selections.pastas, selectedComponent: selections.componentChoices, selectedSideChoices: selections.sideChoices, selectedMultiChoice: selections.multiChoice, selectedSingleChoiceAddon: selections.singleChoiceAddon, selectedNotes: selections.notes, totalPrice };
        
        if (editingItem) { setCartItems(prev => prev.map(ci => ci.cartId === editingItem.cartId ? newCartItem : ci)); } 
        else { setCartItems(prev => { const existingItem = prev.find(ci => ci.cartKey === cartKey); if (existingItem) return prev.map(ci => ci.cartKey === cartKey ? { ...ci, quantity: ci.quantity + quantity, totalPrice: ci.totalPrice + totalPrice } : ci); return [...prev, newCartItem]; }); }
        handleCloseModal();
    };

    const handleUpdateQuantity = (cartId: string, newQuantity: number) => {
        setCartItems(prev => {
          if (newQuantity <= 0) return prev.filter(item => item.cartId !== cartId);
          return prev.map(item => {
            if (item.cartId !== cartId) return item;
            const oldQuantity = item.quantity; if (oldQuantity === newQuantity) return item;
            const scale = newQuantity / oldQuantity;
            const scaleAndAdjust = (obj: any, targetTotal: number) => { if (!obj || Object.keys(obj).length === 0) return obj; const scaled = Object.entries(obj).map(([key, value]) => ({ key, value: Number(value) * scale })); const rounded = scaled.map(pair => ({ ...pair, value: Math.round(pair.value) })); let currentTotal = rounded.reduce((sum, pair) => sum + pair.value, 0); let diff = targetTotal - currentTotal; while (diff !== 0) { const errors = scaled.map((s, i) => ({ index: i, error: s.value - rounded[i].value })); if (diff > 0) { errors.sort((a, b) => b.error - a.error); rounded[errors[0].index].value++; diff--; } else { errors.sort((a, b) => a.error - b.error); const targetIndex = errors.findIndex(e => rounded[e.index].value > 0); if (targetIndex !== -1) rounded[errors[targetIndex].index].value--; else break; diff++; } } return Object.fromEntries(rounded.filter(pair => pair.value > 0).map(pair => [pair.key, pair.value])); };
            const scaleArrayQuantities = (arr: any[]) => { if (!arr || arr.length === 0) return arr; return arr.map(subItem => ({ ...subItem, quantity: Math.max(1, Math.round(subItem.quantity * scale)) })).filter(si => si.quantity > 0); };
            const custom = item.item.customizations || {};
            return { ...item, quantity: newQuantity, totalPrice: (item.totalPrice / oldQuantity) * newQuantity, selectedDonenesses: custom.doneness ? scaleAndAdjust(item.selectedDonenesses, newQuantity) : item.selectedDonenesses, selectedDrinks: custom.drinkChoice ? scaleAndAdjust(item.selectedDrinks, newQuantity) : item.selectedDrinks, selectedComponent: custom.componentChoice ? scaleAndAdjust(item.selectedComponent, newQuantity) : item.selectedComponent, selectedMultiChoice: custom.multiChoice ? scaleAndAdjust(item.selectedMultiChoice, newQuantity) : item.selectedMultiChoice, selectedSideChoices: custom.sideChoice ? scaleAndAdjust(item.selectedSideChoices, custom.sideChoice.choices * newQuantity) : item.selectedSideChoices, selectedSauces: scaleArrayQuantities(item.selectedSauces), selectedDesserts: scaleArrayQuantities(item.selectedDesserts), selectedPastas: scaleArrayQuantities(item.selectedPastas), selectedAddons: scaleArrayQuantities(item.selectedAddons) };
          });
        });
    };

    const handleRemoveItem = (cartId: string) => setCartItems(prev => prev.filter(item => item.cartId !== cartId));
    
    // STRICT KIOSK: Force fullscreen on welcome agree
    const handleWelcomeAgree = () => { 
        setShowWelcome(false); 
        setShowGuestCountModal(true); 
        enterFullscreen(); 
    };

    // STRICT KIOSK: Force fullscreen on guest count confirm
    const handleGuestCountConfirm = (count: number) => { 
        setGuestCount(count); 
        setShowGuestCountModal(false);
        enterFullscreen();
    };

    const handleSubmitAndPrint = async (orderData: Partial<Order>) => {
        if (isSubmitting) return; setIsSubmitting(true);
        try {
            const finalOrderData = { ...orderData, guestCount };
            const result = await apiService.submitOrder(finalOrderData);
            if (result.success === true && result.order) { setOrderToPrint(result.order); } else { alert('Order failed.'); setIsSubmitting(false); }
        } catch (error: any) { alert(`Error: ${error.message}`); setIsSubmitting(false); }
    };

    const handleNavigateToAdmin = () => { const password = prompt("請輸入管理員密碼以進入後台:", ""); if (password === "@Howardwang5172") setIsAdminOpen(true); else if (password !== null) alert("密碼錯誤"); };
    const toggleLanguage = () => { setLanguage(prev => prev === 'zh' ? 'en' : 'zh'); setCartItems([]); setIsCartOpen(false); };

    // STRICT KIOSK: Force fullscreen when closing cart (pressing X)
    const handleCloseCart = () => {
        setIsCartOpen(false);
        enterFullscreen();
    };

    // STRICT KIOSK: Handlers for other modals (Query, Admin)
    const handleCloseQueryModal = () => {
        setIsQueryModalOpen(false);
        enterFullscreen();
    };

    const handleCloseAdmin = () => {
        setIsAdminOpen(false);
        enterFullscreen();
    };

    useEffect(() => {
        if (orderToPrint) {
          const handleAfterPrint = () => { setOrderToPrint(null); setCartItems([]); setIsCartOpen(false); setShowWelcome(true); setGuestCount(1); setIsSubmitting(false); window.removeEventListener('afterprint', handleAfterPrint); };
          window.addEventListener('afterprint', handleAfterPrint);
          const timer = setTimeout(() => window.print(), 150);
          return () => { clearTimeout(timer); window.removeEventListener('afterprint', handleAfterPrint); };
        }
    }, [orderToPrint]);
    
    const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    if (isAdminOpen) return <AdminPanel onBack={handleCloseAdmin} />;
    if (showWelcome) return <WelcomeModal onAgree={handleWelcomeAgree} t={t} />;
    if (showGuestCountModal) return <GuestCountModal onConfirm={handleGuestCountConfirm} t={t} />;

    return (
        <div className="flex min-h-screen h-screen overflow-hidden">
          <aside className="no-print w-64 bg-white shadow-lg fixed top-0 left-0 h-full overflow-y-auto hidden lg:block no-scrollbar z-10">
            <div className="p-6"><h1 className="text-2xl font-bold text-green-700 cursor-pointer select-none" onDoubleClick={handleNavigateToAdmin} title="雙擊進入管理後台">{t.title}</h1></div>
            <nav className="mt-4"><ul>{menuData.map((category) => (<li key={category.title}><a href={`#${category.title}`} className="block px-6 py-3 text-slate-600 font-semibold hover:bg-slate-100 hover:text-green-700 transition-colors">{category.title}</a></li>))}</ul></nav>
          </aside>
          <main className="lg:ml-64 flex-1 h-full overflow-y-auto bg-slate-100 no-scrollbar">
            <header className="no-print bg-white/80 backdrop-blur-sm p-4 shadow-md sticky top-0 z-20 flex justify-between items-center">
                <div className="flex items-center gap-4"><h1 className="text-xl font-bold text-green-700 lg:hidden cursor-pointer select-none" onDoubleClick={handleNavigateToAdmin}>{t.title}</h1><button onClick={toggleLanguage} className="text-sm font-bold text-slate-600 border border-slate-300 rounded px-3 py-1 hover:bg-slate-100">{language === 'zh' ? 'English' : '中文'}</button></div>
                <div className="flex items-center gap-3"><button onClick={handleSoftReload} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"><RefreshIcon className="h-5 w-5"/><span className="hidden sm:inline">{t.refresh}</span></button><button onClick={() => setIsQueryModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"><SearchIcon /><span className="hidden sm:inline">{t.searchOrder}</span></button></div>
            </header>
            {isQuietHours ? (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] text-center p-4"><h2 className="text-3xl font-bold text-slate-700 mb-4">{t.shopClosed}</h2><p className="text-slate-500">{t.shopClosedDesc}</p></div>
            ) : isLoading ? (
              <div className="flex items-center justify-center h-[calc(100vh-80px)]"><p className="text-slate-500">{t.loading}</p></div>
            ) : (<div className="p-6 lg:p-10"><Menu menuData={menuData} onSelectItem={handleSelectItem} t={t} /></div>)}
          </main>
          {!isQuietHours && (<div className="fixed bottom-6 right-6 z-30 no-print"><button onClick={() => setIsCartOpen(true)} className="bg-green-600 text-white rounded-full shadow-lg p-4 hover:bg-green-700 transition-transform transform hover:scale-110"><CartIcon className="h-8 w-8" />{totalCartItems > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">{totalCartItems}</span>}</button></div>)}
          {selectedItem && (<ItemModal selectedItem={selectedItem} editingItem={editingItem} addons={addons} options={options} onClose={handleCloseModal} onConfirmSelection={handleConfirmSelection} t={t} />)}
          <Cart isOpen={isCartOpen} onClose={handleCloseCart} cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} onEditItem={handleEditItem} onSubmitAndPrint={handleSubmitAndPrint} isSubmitting={isSubmitting} t={t} />
          <OrderQueryModal isOpen={isQueryModalOpen} onClose={handleCloseQueryModal} t={t} />
          {orderToPrint && printContainerRef.current && createPortal(<PrintableOrder order={orderToPrint} />, printContainerRef.current)}
        </div>
    );
};

export default App;
