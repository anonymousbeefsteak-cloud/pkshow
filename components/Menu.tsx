import React, { useState } from 'react';
import { MenuCategory, MenuItem } from '../types';
import { PlusIcon } from './Icons';

interface MenuProps {
  menuData: MenuCategory[];
  onSelectItem: (item: MenuItem, category: MenuCategory) => void;
  t: any;
}

export const Menu: React.FC<MenuProps> = ({ menuData, onSelectItem, t }) => {
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

    const handleImageClick = (e: React.MouseEvent, imgUrl: string) => {
        e.stopPropagation(); // Prevent card click logic
        setFullscreenImage(imgUrl);
    };

    return (
      <>
        <div className="space-y-12">
          {menuData.map((category) => (
            <div key={category.title} id={category.title}>
              <div className="mb-6 pb-2 border-b-2 border-green-700">
                <h2 className="text-3xl font-bold text-slate-800">{category.title}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item) => {
                  const hasOtherOptions = item.customizations.dessertChoice || item.customizations.multiChoice || item.customizations.singleChoiceAddon;
                  return (
                    <div key={item.id} className={`bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform transform hover:scale-105 relative ${!item.isAvailable ? 'opacity-60 bg-slate-50 cursor-not-allowed' : ''}`}>
                      {!item.isAvailable && <div className="absolute top-4 right-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full z-10 transform -rotate-12">{t.soldOut}</div>}
                      
                      {/* Image Section */}
                      {item.image && (
                          <div className="relative h-48 w-full bg-gray-200 overflow-hidden group">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-110"
                                onClick={(e) => handleImageClick(e, item.image!)}
                              />
                              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded pointer-events-none">點擊放大</div>
                          </div>
                      )}

                      <div className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900">{item.name.replace(/半全餐|半套餐/g, '套餐')}</h3>
                          {item.weight && <p className="text-sm text-slate-500">{item.weight}</p>}
                          {item.description && <p className="text-xs text-slate-500 mt-1">{item.description}</p>}
                          <p className="text-2xl font-bold text-green-700 mt-2">${item.price}</p>
                          {item.customizations && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {item.customizations.doneness && <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">{t.options.doneness}</span>}
                              {item.customizations.sauceChoice && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{t.options.sauce}</span>}
                              {item.customizations.drinkChoice && <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">{t.options.drink}</span>}
                              {hasOtherOptions && <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Options</span>}
                            </div>
                          )}
                        </div>
                        <button onClick={() => onSelectItem(item, category)} disabled={!item.isAvailable} className="mt-4 w-full flex items-center justify-center bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"><PlusIcon className="h-5 w-5 mr-2" /><span>{item.isAvailable ? t.addToCart : t.soldOut}</span></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Fullscreen Image Lightbox */}
        {fullscreenImage && (
            <div className="fixed inset-0 z-[100] bg-black bg-opacity-95 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setFullscreenImage(null)}>
                <img src={fullscreenImage} alt="Fullscreen Preview" className="max-w-full max-h-full object-contain rounded-md shadow-2xl" />
                <button className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-white/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        )}
      </>
    );
};