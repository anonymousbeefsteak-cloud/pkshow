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
    case 'set-6': return '板12';
    case 'set-7': return '蓋12';
    case 'set-8': return '鴨胸';
    case 'set-9': return '煎魚';
    case 'set-10': return '雞腿';
    case 'set-11': return '豬排';
    case 'set-12': return '炸魚';
    case 'set-13': return '日豬';
    case 'set-14': return '海7';
    case 'set-15': return '海14';
    case 'set-16': return '海21';
    case 'combo-1': return '日+雞+蓋組合餐';
    case 'combo-2': return '魚+雞+板組合餐';
    case 'combo-3': return '魚+鴨+豬組合餐';
    case 'combo-4': return '鴨+魚+蓋組合餐';
    case 'dessert-choice-single':
    case 'dessert-choice-set': {
        const dessertName = cartItem.selectedDesserts?.[0]?.name;
        const suffix = id.includes('single') ? '單' : '套';
        if(dessertName?.includes('布蕾') || dessertName?.includes('Brûlée')) return `布蕾${suffix}`;
        if(dessertName?.includes('融岩') || dessertName?.includes('Lava')) return `溶岩${suffix}`;
        if(dessertName?.includes('波士頓') || dessertName?.includes('Boston')) return `波士${suffix}`;
        return '任選甜品';
    }
    default:
        return item.itemShortName || item.name;
  }
};

const PrintableOrder: React.FC<PrintableOrderProps> = ({ order }) => {
  if (!order) return null;

  const meals = new Map();
  const addons = new Map();
  const drinks = new Map();
  const sauces = new Map();

  const addToMap = (map: Map<any, any>, cartItem: CartItem) => {
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
          const addonName = cartItem.item.printShortName || cartItem.item.printName || cartItem.item.name;
          const key = `${addonName}-${cartItem.item.price}`;
          const current = addons.get(key) || { name: addonName, price: cartItem.item.price, quantity: 0 };
          current.quantity += cartItem.quantity;
          addons.set(key, current);
      }

      if (cartItem.selectedAddons) {
          cartItem.selectedAddons.forEach(a => {
              const addonName = a.printName || a.name;
              const key = `${addonName}-${a.price}`;
              const current = addons.get(key) || { name: addonName, price: a.price, quantity: 0 };
              current.quantity += a.quantity;
              addons.set(key, current);
          });
      }

      if (cartItem.selectedDrinks) {
          Object.entries(cartItem.selectedDrinks).forEach(([name, q]) => {
              let drinkName = name;
              if(name.includes('Black Tea') || name.includes('無糖紅茶')) drinkName = '無糖紅茶';
              if(name.includes('Cola') || name.includes('可樂')) drinkName = '冰涼可樂';
              if(name.includes('Green Tea') || name.includes('綠茶')) drinkName = '綠茶';
              if(name.includes('Lemonade') || name.includes('檸檬')) drinkName = '檸檬汁';
              drinks.set(drinkName, (drinks.get(drinkName) || 0) + Number(q));
          });
      }

      if (cartItem.selectedSauces) {
          cartItem.selectedSauces.forEach(s => {
              let sauceName = s.name;
              if(sauceName.includes('Garlic') || sauceName.includes('蒜')) sauceName = '生蒜片';
              if(sauceName.includes('Black Pepper') || sauceName.includes('黑胡椒')) sauceName = '黑胡椒';
              if(sauceName.includes('Mushroom') || sauceName.includes('蘑菇')) sauceName = '蘑菇';
              if(sauceName.includes('Balsamic') || sauceName.includes('醋')) sauceName = '巴薩米克醋';
              if(sauceName.includes('Tomato') || sauceName.includes('蕃茄')) sauceName = '蕃茄醬';
              if(sauceName.includes('Orange') || sauceName.includes('橙汁')) sauceName = '橙汁醬';
              if(sauceName.includes('Thai') || sauceName.includes('泰式')) sauceName = '泰式';
              if(sauceName.includes('Kimchi') || sauceName.includes('泡菜')) sauceName = '泡菜';
              if(sauceName.includes('Pepper Salt') || sauceName.includes('椒鹽')) sauceName = '椒鹽';
              if(sauceName.includes('Mustard') || sauceName.includes('芥末')) sauceName = '芥末';
              if(sauceName.includes('BBQ')) sauceName = 'BBQ醬';
              sauces.set(sauceName, (sauces.get(sauceName) || 0) + s.quantity);
          });
      }
  });

  const containerStyle = {
      width: '58mm',
      fontFamily: "'Noto Sans TC', sans-serif",
      fontSize: '30px',
      fontWeight: '900',
      lineHeight: '1.0',
      color: 'black',
      backgroundColor: 'white',
      margin: 0,
      padding: 0,
      whiteSpace: 'pre-wrap' as const
  };

  const sectionHeaderStyle = {
      fontSize: '30px',
      fontWeight: '900',
      marginTop: '3px',
      marginBottom: '0px'
  };

  const itemStyle = {
      marginBottom: '0px'
  };

  const detailStyle = {
      fontSize: '26px', 
      fontWeight: '900',
      paddingLeft: '0px',
      marginBottom: '0px'
  };
  
  const noteStyle = {
      fontSize: '24px',
      fontWeight: '700'
  };

  const renderMealsSection = (title: string, map: Map<any, any>) => {
      if (map.size === 0) return null;
      return (
          <React.Fragment>
              <div style={sectionHeaderStyle}>{title}</div>
              {Array.from(map.values()).map((m: any, idx) => {
                  const donenessStr = Array.from(m.donenessMap.entries())
                      .map(([d, q]) => `${d}x${q}`)
                      .join('.');
                  return (
                    <div key={`meals-${idx}`} style={itemStyle}>
                        <div>{m.name}(${m.price})x{m.quantity}</div>
                        {donenessStr && <div style={detailStyle}>{donenessStr}</div>}
                        {m.notes.map((note: string, i: number) => (
                            <div key={`n-${i}`} style={noteStyle}>*備註: {note}</div>
                        ))}
                    </div>
                  );
              })}
          </React.Fragment>
      );
  };

  return (
    <div style={containerStyle}>
      <div style={{marginBottom: '3px'}}>
        {order.guestCount ? `人數x ${order.guestCount}   ` : ''}總計${order.totalPrice}
      </div>

      {renderMealsSection('(餐點)', meals)}

      {addons.size > 0 && (
          <React.Fragment>
            <div style={sectionHeaderStyle}>(加購)</div>
            {Array.from(addons.values()).map((a: any, idx) => (
                <div key={`a-${idx}`} style={itemStyle}>
                    {a.name}(${a.price}) x{a.quantity}
                </div>
            ))}
          </React.Fragment>
      )}

      {drinks.size > 0 && (
          <React.Fragment>
            <div style={sectionHeaderStyle}>(飲料)</div>
            {Array.from(drinks.entries()).map(([name, quantity], idx) => (
                <div key={`d-${idx}`} style={itemStyle}>
                    {name} x{quantity}
                </div>
            ))}
          </React.Fragment>
      )}

      {sauces.size > 0 && (
          <React.Fragment>
            <div style={sectionHeaderStyle}>(沾醬)</div>
            {Array.from(sauces.entries()).map(([name, quantity], idx) => (
                <div key={`s-${idx}`} style={itemStyle}>
                    {name} x{quantity}
                </div>
            ))}
          </React.Fragment>
      )}
    </div>
  );
};

export default PrintableOrder;