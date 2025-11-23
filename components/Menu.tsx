
import React from 'react';
import { MenuCategory, MenuItem } from '../types';
import { PlusIcon } from './Icons';

interface MenuProps {
  menuData: MenuCategory[];
  onSelectItem: (item: MenuItem, category: MenuCategory) => void;
  t: any;
}

export const Menu: React.FC<MenuProps> = ({ menuData, onSelectItem, t }) => {
    return (
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
                    
                    {item.image && (
                      <div className="h-48 w-full overflow-hidden relative z-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        {/* Add subtle gradient overlay to bottom of image if needed */}
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
    );
};
