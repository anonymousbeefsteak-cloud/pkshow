import React from 'react';
import { Order, CartItem } from '../types';

interface PrintableOrderProps {
  order: Order;
}

const getPrintableItemName = (cartItem: CartItem): string => {
  const item = cartItem.item;
  const id = item.id;
  const hasChicken = (cartItem.selectedComponent?.['脆皮炸雞'] || cartItem.selectedComponent?.['Crispy Chicken'] || 0) > 0;

  if (item.printShortName) return item.printShortName;

  switch (id) {
    case 'set-1': return hasChicken ? '板雞3+4套餐' : '板魚3+4套餐';
    case 'set-2': return hasChicken ? '板雞6+4套餐' : '板魚6+4套餐';
    case 'set-3': return hasChicken ? '板雞10+4套餐' : '板魚10+4套餐';
    case 'set-4': return hasChicken ? '蓋雞3+4套餐' : '蓋魚3+4套餐';
    case 'set-5': return hasChicken ? '蓋雞6+4套餐' : '蓋魚6+4套餐';
    case 'combo-1': return '日+雞+蓋組合餐';
    case 'combo-2': return '魚+雞+板組合餐';
    case 'combo-3': return '魚+鴨+豬組合餐';
    case 'combo-4': return '鴨+魚+蓋組合餐';
    case 'dessert-choice-single':
    case 'dessert-choice-set': {
        const dessertName = cartItem.selectedDesserts?.[0]?.name;
        const suffix = id.includes('single') ? '單' : '套';
        if(dessertName?.includes('布蕾') || dessertName?.includes('Brûlée')) return `布蕾${suffix}`;
        return '任選甜品';
    }
    default:
        return item.itemShortName || item.name;
  }
};

export const PrintableOrder: React.FC<PrintableOrderProps> = ({ order }) => {
  if (!order) return null;

  const meals = new Map();
  const addons = new Map();
  const drinks = new Map();
  const sauces = new Map();

  const addToMap = (map: Map<string, any>, cartItem: CartItem) => {
      const name = getPrintableItemName(cartItem);
      const key = `${name}-${cartItem.item.price}`;
      
      const current = map.get(key) || { name, price: cartItem.item.price, quantity: 0, donenessMap: new Map(), notes: [] };
      current.quantity += cartItem.quantity;

      if (cartItem.selectedDonenesses) {
          Object.entries(cartItem.selectedDonenesses).forEach(([d, q]) => {
              let label = d.replace('分熟', '分');
              if(label === 'Rare') label = '3分';
              if(label === 'Medium Rare') label = '3分';
              if(label === 'Medium') label = '5分';
              if(label === 'Medium Well') label = '7分';
              if(label === 'Well Done') label = '全熟';
              
              current.donenessMap.set(label, (current.donenessMap.get(label) || 0) + Number(q));
          });
      }
      
      if (cartItem.selectedNotes) {
          current.notes.push(cartItem.selectedNotes);
      }

      map.set(key, current);
  };

  order.items.forEach(cartItem => {
      const id = cartItem.item.id;
      if (!id.startsWith('addon-')) {
          addToMap(meals, cartItem);
      } else {
          const addonName = cartItem.item.printShortName || (cartItem.item as any).printName || cartItem.item.name;
          const key = `${addonName}-${cartItem.item.price}`;
          const current = addons.get(key) || { name: addonName, price: cartItem.item.price, quantity: 0 };
          current.quantity += cartItem.quantity;
          addons.set(key, current);
      }

      if (cartItem.selectedAddons) {
          cartItem.selectedAddons.forEach(a => {
              const addonName = (a as any).printName || a.name;
              const key = `${addonName}-${a.price}`;
              const current = addons.get(key) || { name: addonName, price: a.price, quantity: 0 };
              current.quantity += a.quantity;
              addons.set(key, current);
          });
      }

      if (cartItem.selectedDrinks) {
          Object.entries(cartItem.selectedDrinks).forEach(([name, q]) => {
              let drinkName = name;
              if(name.includes('Black Tea')) drinkName = '無糖紅茶';
              if(name.includes('Cola')) drinkName = '冰涼可樂';
              drinks.set(drinkName, (drinks.get(drinkName) || 0) + Number(q));
          });
      }

      if (cartItem.selectedSauces) {
          cartItem.selectedSauces.forEach(s => {
              let sauceName = s.name;
              if(sauceName === 'Garlic Chips') sauceName = '生蒜片';
              if(sauceName === 'Black Pepper') sauceName = '黑胡椒';
              if(sauceName === 'Mushroom') sauceName = '蘑菇';
              sauces.set(sauceName, (sauces.get(sauceName) || 0) + s.quantity);
          });
      }
  });

  const containerStyle = { width: '58mm', fontFamily: "'Noto Sans TC', sans-serif", fontSize: '30px', fontWeight: '900', lineHeight: '1.1', color: 'black', backgroundColor: 'white', margin: 0, padding: 0, whiteSpace: 'pre-wrap' } as React.CSSProperties;
  const sectionHeaderStyle = { fontSize: '30px', fontWeight: '900', marginTop: '5px', marginBottom: '0px' };
  const itemStyle = { marginBottom: '0px' };
  const detailStyle = { fontSize: '26px', fontWeight: '900', paddingLeft: '0px' };
  const noteStyle = { fontSize: '24px', fontWeight: '700' };

  const renderMealsSection = (title: string, map: Map<string, any>) => {
      if (map.size === 0) return null;
      return (
          <React.Fragment>
              <div style={sectionHeaderStyle}>{title}</div>
              {Array.from(map.values()).map((m, idx) => {
                  const donenessStr = Array.from(m.donenessMap.entries()).map(([d, q]) => `${d}x${q}`).join('.');
                  return (
                    <div key={`meals-${idx}`} style={itemStyle}>
                        <div>{m.name}(${m.price})x{m.quantity}</div>
                        {donenessStr && <div style={detailStyle}>{donenessStr}</div>}
                        {m.notes.map((note: string, i: number) => (<div key={`n-${i}`} style={noteStyle}>*備註: {note}</div>))}
                    </div>
                  );
              })}
          </React.Fragment>
      );
  };

  return (
    <div style={containerStyle}>
      <div style={{marginBottom: '5px'}}>{order.guestCount ? `人數x ${order.guestCount}   ` : ''}總計${order.totalPrice}</div>
      {renderMealsSection('(餐點)', meals)}
      {addons.size > 0 && (<><div style={sectionHeaderStyle}>(加購)</div>{Array.from(addons.values()).map((a, idx) => (<div key={`a-${idx}`} style={itemStyle}>{a.name}(${a.price}) x{a.quantity}</div>))}</>)}
      {drinks.size > 0 && (<><div style={sectionHeaderStyle}>(飲料)</div>{Array.from(drinks.entries()).map(([name, quantity], idx) => (<div key={`d-${idx}`} style={itemStyle}>{name} x{quantity}</div>))}</>)}
      {sauces.size > 0 && (<><div style={sectionHeaderStyle}>(沾醬)</div>{Array.from(sauces.entries()).map(([name, quantity], idx) => (<div key={`s-${idx}`} style={itemStyle}>{name} x{quantity}</div>))}</>)}
    </div>
  );
};