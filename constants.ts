import { MenuCategory, Addon } from './types';

export const MENU_DATA: MenuCategory[] = [
  {
    title: "套餐",
    items: [
      { id: 'set-1', name: '板腱牛排+脆皮炸雞或炸魚套餐', itemShortName: '板腱牛+雞/魚餐', weight: '7oz (3oz牛排+4oz雞/魚)', price: 299, description: "附:①日湯②麵包③主餐④脆薯⑤飲料", image: "https://anonymousbeefsteak-cloud.github.io/pktry/2.jpg", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2, componentChoice: { title: '炸物選擇', options: ['脆皮炸雞', '炸魚'] } }, isAvailable: true },
      { id: 'set-2', name: '板腱牛排+脆皮炸雞或炸魚套餐', itemShortName: '板腱牛+雞/魚餐', weight: '10oz (6oz牛排+4oz雞/魚)', price: 399, description: "附:①日湯②麵包③主餐④脆薯⑤飲料", image: "https://anonymousbeefsteak-cloud.github.io/pktry/2.jpg", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2, componentChoice: { title: '炸物選擇', options: ['脆皮炸雞', '炸魚'] } }, isAvailable: true },
      { id: 'set-3', name: '板腱牛排+脆皮炸雞或炸魚套餐', itemShortName: '板腱牛+雞/魚餐', weight: '14oz (10oz牛排+4oz雞/魚)', price: 499, description: "附:①日湯②麵包③主餐④脆薯⑤飲料", image: "https://anonymousbeefsteak-cloud.github.io/pktry/2.jpg", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2, componentChoice: { title: '炸物選擇', options: ['脆皮炸雞', '炸魚'] } }, isAvailable: true },
      { id: 'set-4', name: '上蓋牛排+脆皮炸雞或炸魚套餐', itemShortName: '上蓋牛+雞/魚餐', weight: '7oz (3oz牛排+4oz雞/魚)', price: 299, description: "附:①日湯②麵包③主餐④脆薯⑤飲料", image: "https://anonymousbeefsteak-cloud.github.io/pktry/3.jpg", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2, componentChoice: { title: '炸物選擇', options: ['脆皮炸雞', '炸魚'] } }, isAvailable: true },
      { id: 'set-5', name: '上蓋牛排+脆皮炸雞或炸魚套餐', itemShortName: '上蓋牛+雞/魚餐', weight: '10oz (6oz牛排+4oz雞/魚)', price: 399, description: "附:①日湯②麵包③主餐④脆薯⑤飲料", image: "https://anonymousbeefsteak-cloud.github.io/pktry/3.jpg", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2, componentChoice: { title: '炸物選擇', options: ['脆皮炸雞', '炸魚'] } }, isAvailable: true },
      { id: 'set-6', name: '板腱牛排套餐', itemShortName: '板腱牛套餐', printShortName: '板12', weight: '12oz', price: 499, description: "附:①日湯②麵包③主餐④脆薯⑤飲料", image: "https://anonymousbeefsteak-cloud.github.io/pktry/b1.png", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'set-7', name: '上蓋牛排套餐', itemShortName: '上蓋牛套餐', printShortName: '蓋12', weight: '12oz', price: 499, description: "附:①日湯②麵包③主餐④脆薯⑤飲料", image: "https://anonymousbeefsteak-cloud.github.io/pktry/b1.png", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'set-8', name: '香煎櫻桃鴨胸套餐', itemShortName: '鴨胸套餐', printShortName: '鴨胸', weight: '10oz', price: 399, description: "附:①日湯②麵包③主餐④脆薯⑤飲料", image: "https://anonymousbeefsteak-cloud.github.io/pktry/duck.png", customizations: { doneness: false, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'set-9', name: '香煎鮮嫩魚套餐', itemShortName: '香煎魚套餐', printShortName: '煎魚', weight: '10oz', price: 320, description: "附:①日湯②麵包③主餐④脆薯⑤飲料", image: "https://anonymousbeefsteak-cloud.github.io/pktry/fish.png", customizations: { doneness: false, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'set-10', name: '香煎鮮嫩雞腿套餐', itemShortName: '雞腿套餐', printShortName: '雞腿', weight: '10oz', price: 250, description: "附:①日湯②麵包③主餐④脆薯⑤飲料", image: "https://anonymousbeefsteak-cloud.github.io/pktry/chicken.png", customizations: { doneness: false, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'set-11', name: '香煎美味豬排套餐', itemShortName: '豬排套餐', printShortName: '豬10', weight: '10oz', price: 299, description: "附:①日湯②麵包③主餐④脆薯⑤飲料", image: "https://anonymousbeefsteak-cloud.github.io/pktry/p.png", customizations: { doneness: false, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'set-12', name: '英式炸魚套餐', itemShortName: '炸魚套餐', printShortName: '炸魚', weight: '10oz', price: 250, description: "附:①日湯②麵包③主餐④脆薯⑤飲料", image: "https://anonymousbeefsteak-cloud.github.io/pktry/fish2.png", customizations: { doneness: false, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'set-13', name: '日式豬排套餐', itemShortName: '日豬套餐', printShortName: '日豬', weight: '10oz', price: 250, description: "附:①日湯②麵包③主餐④脆薯⑤飲料", image: "https://anonymousbeefsteak-cloud.github.io/pktry/pce.png", customizations: { doneness: false, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'set-14', name: '海盜牛排套餐', itemShortName: '海盜牛套餐', printShortName: '海7', weight: '7oz', price: 299, description: "附:①日湯②麵包③主餐④脆薯⑤飲料", image: "https://anonymousbeefsteak-cloud.github.io/pktry/pirate.png", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'set-15', name: '海盜牛排套餐', itemShortName: '海盜牛套餐', printShortName: '海14', weight: '14oz', price: 399, description: "附:①日湯②麵包③主餐④脆薯⑤飲料", image: "https://anonymousbeefsteak-cloud.github.io/pktry/pirate.png", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'set-16', name: '海盜牛排套餐', itemShortName: '海盜牛套餐', printShortName: '海21', weight: '21oz', price: 499, description: "附:①日湯②麵包③主餐④脆薯⑤飲料", image: "https://anonymousbeefsteak-cloud.github.io/pktry/pirate.png", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
    ]
  },
  {
    title: "組合餐",
    items: [
      { id: 'combo-1', name: '日豬、雞腿、上蓋組合餐', itemShortName: '日豬雞上蓋餐', printShortName: '日+雞+蓋組合餐', weight: '15oz', price: 529, description: "附:①日湯②麵包③主餐④脆薯⑤飲料", image: "https://anonymousbeefsteak-cloud.github.io/pktry/combo1.png", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'combo-2', name: '炸魚、雞腿、板腱組合餐', itemShortName: '炸魚雞板腱餐', printShortName: '魚+雞+板組合餐', weight: '15oz', price: 529, description: "附:①日湯②麵包③主餐④脆薯⑤飲料", image: "https://anonymousbeefsteak-cloud.github.io/pktry/combo2.png", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2, componentChoice: { title: '炸物選擇', options: ['脆皮炸雞', '炸魚'] } }, isAvailable: true },
      { id: 'combo-3', name: '煎魚、鴨胸、豬排組合餐', itemShortName: '魚鴨豬組合餐', printShortName: '魚+鴨+豬組合餐', weight: '15oz', price: 529, description: "附:①日湯②麵包③主餐④脆薯⑤飲料", image: "https://anonymousbeefsteak-cloud.github.io/pktry/combo3.png", customizations: { doneness: false, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'combo-4', name: '鴨胸、煎魚、上蓋組合餐', itemShortName: '鴨魚上蓋餐', printShortName: '鴨+魚+蓋組合餐', weight: '15oz', price: 599, description: "附:①日湯②麵包③主餐④脆薯⑤飲料", image: "https://anonymousbeefsteak-cloud.github.io/pktry/combo4.png", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
    ]
  },
  {
    title: "簡餐",
    items: [
      { id: 'simple-meal-set', name: '簡餐套餐', itemShortName: '簡餐套餐', price: 175, description: "套餐附:①日湯 ②主餐 ③脆薯 ④甜品 ⑤飲料", customizations: { 
        drinkChoice: true, 
        notes: true, 
        multiChoice: { 
          title: '主餐選擇', 
          options: ["黃金脆皮炸雞塊", "黃金泡菜脆皮雞塊吃到堡", "華夫蘋果沙拉雞塊吃到堡", "蛋沙拉脆皮雞塊吃到堡", "波士頓花生冰淇淋吃到堡", "溶岩巧克佐冰淇淋吃到堡"] 
        }
      }, isAvailable: true },
      { id: 'simple-meal-single', name: '簡餐單點', itemShortName: '簡餐單點', price: 75, description: "簡餐附(選二)→①日湯 ②脆薯 ③甜品 ④飲料", customizations: { 
        notes: true, 
        multiChoice: { 
          title: '主餐選擇', 
          options: ["黃金脆皮炸雞塊", "黃金泡菜脆皮雞塊吃到堡", "華夫蘋果沙拉雞塊吃到堡", "蛋沙拉脆皮雞塊吃到堡", "波士頓花生冰淇淋吃到堡", "溶岩巧克佐冰淇淋吃到堡"] 
        },
        sideChoice: { 
          title: '附餐選擇 (請選二)', 
          options: ["日湯", "脆薯", "甜品", "飲料"],
          choices: 2
        }
      }, isAvailable: true },
    ]
  },
  {
    title: "涼麵",
    items: [
      { id: 'cold-noodle-single', name: '涼麵', itemShortName: '涼麵', price: 75, description: "單點。請選擇口味", customizations: { 
        multiChoice: { 
          title: '涼麵口味', 
          options: ["日式涼麵", "泰式涼麵", "沙茶涼麵", "蒜香涼麵", "金瓜涼麵", "巴薩米醋涼麵", "香葱涼麵", "凱撒涼麵", "橙汁涼麵", "黑胡椒涼麵", "台式涼麵", "BBQ涼麵"] 
        }, 
        notes: true 
      }, isAvailable: true },
      { id: 'cold-noodle-set', name: '涼麵套餐', itemShortName: '涼麵套餐', price: 175, description: "附:①日湯②主餐③脆薯④甜品⑤飲料", customizations: { 
        multiChoice: { 
          title: '涼麵口味', 
          options: ["日式涼麵", "泰式涼麵", "沙茶涼麵", "蒜香涼麵", "金瓜涼麵", "巴薩米醋涼麵", "香葱涼麵", "凱撒涼麵", "橙汁涼麵", "黑胡椒涼麵", "台式涼麵", "BBQ涼麵"] 
        }, 
        drinkChoice: true, 
        notes: true 
      }, isAvailable: true },
    ]
  },
  {
    title: "義大利麵",
    items: [
      { id: 'pasta-choice-single', name: '任選義麵 (簡餐)', itemShortName: '任選義麵簡餐', price: 160, description: "簡餐附(選二)→①日湯 ②脆薯 ③甜品 ④飲料", customizations: { 
        pastaChoice: true, 
        notes: true, 
        sideChoice: { 
          title: '簡餐附餐 (請選二)', 
          options: ['日湯', '脆薯', '甜品', '飲料'], 
          choices: 2 
        } 
      }, isAvailable: true },
      { id: 'pasta-choice-set', name: '任選義麵 (套餐)', itemShortName: '任選義麵套餐', price: 250, description: "附:①日湯 ②主餐 ③甜品 ④麵包 ⑤飲料", customizations: { 
        pastaChoice: true, 
        drinkChoice: true, 
        notes: true 
      }, isAvailable: true },
    ]
  },
  {
    title: "甜品",
    items: [
      { id: 'dessert-choice-single', name: '任選甜品', itemShortName: '任選甜品', price: 99, description: "A區、B區各任選一種。", customizations: { 
        dessertChoice: true, 
        notes: true 
      }, isAvailable: true },
      { id: 'dessert-choice-set', name: '任選甜品套餐', itemShortName: '任選甜品套餐', price: 250, description: "附:①日湯②主餐③脆薯④雞塊⑤飲料", customizations: { 
        dessertChoice: true, 
        drinkChoice: true, 
        notes: true 
      }, isAvailable: true },
    ]
  },
];

export const ADDONS: Addon[] = [
  { id: 'addon-top-blade-5oz', name: '板腱加購 5oz', price: 200, category: '主餐加購', isAvailable: true },
  { id: 'addon-ribeye-cap-5oz', name: '上蓋加購 5oz', price: 200, category: '主餐加購', isAvailable: true },
  { id: 'addon-chicken-leg-5oz', name: '雞腿加購 5oz', price: 120, category: '主餐加購', isAvailable: true },
  { id: 'addon-sea-bass-5oz', name: '煎魚加購 5oz', price: 120, category: '主餐加購', isAvailable: true },
  { id: 'addon-duck-breast-5oz', name: '鴨胸加購 5oz', price: 150, category: '主餐加購', isAvailable: true },
  { id: 'addon-fried-fish-5oz', name: '炸魚加購 5oz', price: 120, category: '主餐加購', isAvailable: true },
  { id: 'addon-pork-chop-5oz', name: '豬排加購 5oz', price: 120, category: '主餐加購', isAvailable: true },
  { id: 'addon-jp-pork-cutlet-5oz', name: '日豬加購 5oz', price: 120, category: '主餐加購', isAvailable: true },
  { id: 'addon-pasta', name: '義麵加購', price: 150, category: '主餐加購', isAvailable: true },
  { id: 'addon-soup', name: '湯品 加購', price: 30, category: '單點加購', isAvailable: true },
  { id: 'addon-congee', name: '粥品 加購', price: 60, category: '單點加購', isAvailable: true },
  { id: 'addon-fries', name: '脆薯 加購', price: 60, category: '單點加購', isAvailable: true },
  { id: 'addon-daily-dessert', name: '是日甜品 加購', price: 60, category: '單點加購', isAvailable: true },
  { id: 'addon-drink-side', name: '飲料 加購', price: 20, category: '單點加購', isAvailable: true },
  { id: 'addon-nuggets-side', name: '雞塊 加購', price: 75, category: '單點加購', isAvailable: true },
  { id: 'addon-garlic-bread', name: '蒜法 加購', price: 60, category: '單點加購', isAvailable: true },
  { id: 'addon-dessert-choice', name: '任選甜品 加購', price: 99, category: '單點加購', isAvailable: true },
  { id: 'addon-simple-gold-fried-chicken', name: '黃金脆皮炸雞塊加購', price: 75, category: '簡餐加購', isAvailable: true },
  { id: 'addon-simple-kimchi-burger', name: '黃金泡菜脆皮雞塊吃到堡加購', price: 75, category: '簡餐加購', isAvailable: true },
  { id: 'addon-simple-waffle-apple-burger', name: '華夫蘋果沙拉雞塊吃到堡加購', price: 75, category: '簡餐加購', isAvailable: true },
  { id: 'addon-simple-egg-salad-burger', name: '蛋沙拉脆皮雞塊吃到堡加購', price: 75, category: '簡餐加購', isAvailable: true },
  { id: 'addon-simple-peanut-icecream-burger', name: '波士頓花生冰淇淋吃到堡加購', price: 75, category: '簡餐加購', isAvailable: true },
  { id: 'addon-simple-chocolate-icecream-burger', name: '溶岩巧克佐冰淇淋吃到堡加購', price: 75, category: '簡餐加購', isAvailable: true },
];

export const MENU_DATA_EN: MenuCategory[] = [
  {
    title: "Set Meals",
    items: [
      { id: 'set-1', name: 'Top Blade Steak + Crispy Chicken or Fish Set', printShortName: '板雞3+4套餐', weight: '7oz', price: 299, description: "Includes: ①Soup ②Bread ③Main ④Fries ⑤Drink", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2, componentChoice: { title: 'Select Side Main', options: ['Crispy Chicken', 'Fried Fish'] } }, isAvailable: true },
      { id: 'set-2', name: 'Top Blade Steak + Crispy Chicken or Fish Set', printShortName: '板雞6+4套餐', weight: '10oz', price: 399, description: "Includes: ①Soup ②Bread ③Main ④Fries ⑤Drink", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2, componentChoice: { title: 'Select Side Main', options: ['Crispy Chicken', 'Fried Fish'] } }, isAvailable: true },
      { id: 'set-3', name: 'Top Blade Steak + Crispy Chicken or Fish Set', printShortName: '板雞10+4套餐', weight: '14oz', price: 499, description: "Includes: ①Soup ②Bread ③Main ④Fries ⑤Drink", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2, componentChoice: { title: 'Select Side Main', options: ['Crispy Chicken', 'Fried Fish'] } }, isAvailable: true },
      { id: 'set-4', name: 'Ribeye Cap + Crispy Chicken or Fish Set', printShortName: '蓋雞3+4套餐', weight: '7oz', price: 299, description: "Includes: ①Soup ②Bread ③Main ④Fries ⑤Drink", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2, componentChoice: { title: 'Select Side Main', options: ['Crispy Chicken', 'Fried Fish'] } }, isAvailable: true },
      { id: 'set-5', name: 'Ribeye Cap + Crispy Chicken or Fish Set', printShortName: '蓋雞6+4套餐', weight: '10oz', price: 399, description: "Includes: ①Soup ②Bread ③Main ④Fries ⑤Drink", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2, componentChoice: { title: 'Select Side Main', options: ['Crispy Chicken', 'Fried Fish'] } }, isAvailable: true },
      { id: 'set-6', name: 'Top Blade Steak Set', printShortName: '板12', weight: '12oz', price: 499, description: "Includes: ①Soup ②Bread ③Main ④Fries ⑤Drink", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'set-7', name: 'Ribeye Cap Steak Set', printShortName: '蓋12', weight: '12oz', price: 499, description: "Includes: ①Soup ②Bread ③Main ④Fries ⑤Drink", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'set-8', name: 'Pan-Fried Duck Breast Set', printShortName: '鴨胸', weight: '10oz', price: 399, description: "Includes: ①Soup ②Bread ③Main ④Fries ⑤Drink", customizations: { doneness: false, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'set-9', name: 'Pan-Fried Sea Bass Set', printShortName: '煎魚', weight: '10oz', price: 320, description: "Includes: ①Soup ②Bread ③Main ④Fries ⑤Drink", customizations: { doneness: false, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'set-10', name: 'Pan-Fried Chicken Leg Set', printShortName: '雞腿', weight: '10oz', price: 250, description: "Includes: ①Soup ②Bread ③Main ④Fries ⑤Drink", customizations: { doneness: false, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'set-11', name: 'Pan-Fried Pork Chop Set', printShortName: '豬10', weight: '10oz', price: 299, description: "Includes: ①Soup ②Bread ③Main ④Fries ⑤Drink", customizations: { doneness: false, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'set-12', name: 'British Fish & Chips Set', printShortName: '炸魚', weight: '10oz', price: 250, description: "Includes: ①Soup ②Bread ③Main ④Fries ⑤Drink", customizations: { doneness: false, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'set-13', name: 'Japanese Pork Cutlet Set', printShortName: '日豬', weight: '10oz', price: 250, description: "Includes: ①Soup ②Bread ③Main ④Fries ⑤Drink", customizations: { doneness: false, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'set-14', name: 'Pirate Steak Set', printShortName: '海7', weight: '7oz', price: 299, description: "Includes: ①Soup ②Bread ③Main ④Fries ⑤Drink", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'set-15', name: 'Pirate Steak Set', printShortName: '海14', weight: '14oz', price: 399, description: "Includes: ①Soup ②Bread ③Main ④Fries ⑤Drink", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'set-16', name: 'Pirate Steak Set', printShortName: '海21', weight: '21oz', price: 499, description: "Includes: ①Soup ②Bread ③Main ④Fries ⑤Drink", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
    ]
  },
  {
    title: "Combo Meals",
    items: [
      { id: 'combo-1', name: 'Pork Cutlet, Chicken & Ribeye Cap', printShortName: '日+雞+蓋組合餐', weight: '15oz', price: 529, description: "Includes: ①Soup ②Bread ③Main ④Fries ⑤Drink", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'combo-2', name: 'Fried Fish, Chicken & Top Blade', printShortName: '魚+雞+板組合餐', weight: '15oz', price: 529, description: "Includes: ①Soup ②Bread ③Main ④Fries ⑤Drink", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2, componentChoice: { title: 'Select Side Main', options: ['Crispy Chicken', 'Fried Fish'] } }, isAvailable: true },
      { id: 'combo-3', name: 'Sea Bass, Duck & Pork Chop', printShortName: '魚+鴨+豬組合餐', weight: '15oz', price: 529, description: "Includes: ①Soup ②Bread ③Main ④Fries ⑤Drink", customizations: { doneness: false, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
      { id: 'combo-4', name: 'Duck, Sea Bass & Ribeye Cap', printShortName: '鴨+魚+蓋組合餐', weight: '15oz', price: 599, description: "Includes: ①Soup ②Bread ③Main ④Fries ⑤Drink", customizations: { doneness: true, sauceChoice: true, drinkChoice: true, notes: true, saucesPerItem: 2 }, isAvailable: true },
    ]
  },
  {
    title: "Simple Meals",
    items: [
      { id: 'simple-meal-set', name: 'Simple Meal Set', printShortName: '簡餐套餐', price: 175, description: "Includes: ①Soup ②Main ③Fries ④Dessert ⑤Drink", customizations: { 
        drinkChoice: true, 
        notes: true, 
        multiChoice: { 
          title: 'Select Main Course', 
          options: ["Crispy Fried Chicken", "Kimchi Chicken Burger", "Waffle Apple Salad Burger", "Egg Salad Chicken Burger", "Peanut Ice Cream Burger", "Lava Chocolate Ice Cream Burger"] 
        }
      }, isAvailable: true },
      { id: 'simple-meal-single', name: 'Simple Meal A La Carte', printShortName: '簡餐單點', price: 75, description: "Includes (Choose 2): ①Soup ②Fries ③Dessert ④Drink", customizations: { 
        notes: true, 
        multiChoice: { 
          title: 'Select Main Course', 
          options: ["Crispy Fried Chicken", "Kimchi Chicken Burger", "Waffle Apple Salad Burger", "Egg Salad Chicken Burger", "Peanut Ice Cream Burger", "Lava Chocolate Ice Cream Burger"] 
        },
        sideChoice: { 
          title: 'Select 2 Sides', 
          options: ["Soup", "Fries", "Dessert", "Drink"],
          choices: 2
        }
      }, isAvailable: true },
    ]
  },
  {
    title: "Cold Noodles",
    items: [
      { id: 'cold-noodle-single', name: 'Cold Noodles (Single)', printShortName: '涼麵', price: 75, description: "A la carte. Please choose flavor.", customizations: { 
        multiChoice: { 
          title: 'Flavor', 
          options: ["Japanese", "Thai", "Satay", "Garlic", "Pumpkin", "Balsamic", "Scallion", "Caesar", "Orange", "Black Pepper", "Taiwanese", "BBQ"] 
        }, 
        notes: true 
      }, isAvailable: true },
      { id: 'cold-noodle-set', name: 'Cold Noodles Set', printShortName: '涼麵套餐', price: 175, description: "Includes: ①Soup ②Main ③Fries ④Dessert ⑤Drink", customizations: { 
        multiChoice: { 
          title: 'Flavor', 
          options: ["Japanese", "Thai", "Satay", "Garlic", "Pumpkin", "Balsamic", "Scallion", "Caesar", "Orange", "Black Pepper", "Taiwanese", "BBQ"] 
        }, 
        drinkChoice: true, 
        notes: true 
      }, isAvailable: true },
    ]
  },
  {
    title: "Pasta",
    items: [
      { id: 'pasta-choice-single', name: 'Pasta (Simple Meal)', printShortName: '任選義麵簡餐', price: 160, description: "Includes (Choose 2): ①Soup ②Fries ③Dessert ④Drink", customizations: { 
        pastaChoice: true, 
        notes: true, 
        sideChoice: { 
          title: 'Select 2 Sides', 
          options: ["Soup", "Fries", "Dessert", "Drink"], 
          choices: 2 
        } 
      }, isAvailable: true },
      { id: 'pasta-choice-set', name: 'Pasta (Full Set)', printShortName: '任選義麵套餐', price: 250, description: "Includes: ①Soup ②Main ③Dessert ④Bread ⑤Drink", customizations: { 
        pastaChoice: true, 
        drinkChoice: true, 
        notes: true 
      }, isAvailable: true },
    ]
  },
  {
    title: "Desserts",
    items: [
      { id: 'dessert-choice-single', name: 'Dessert Selection', printShortName: '任選甜品', price: 99, description: "Choose 1 from Zone A and 1 from Zone B.", customizations: { 
        dessertChoice: true, 
        notes: true 
      }, isAvailable: true },
      { id: 'dessert-choice-set', name: 'Dessert Set', printShortName: '任選甜品套餐', price: 250, description: "Includes: ①Soup ②Main ③Fries ④Nuggets ⑤Drink", customizations: { 
        dessertChoice: true, 
        drinkChoice: true, 
        notes: true 
      }, isAvailable: true },
    ]
  },
];

export const ADDONS_EN: Addon[] = [
  { id: 'addon-top-blade-5oz', name: 'Add Top Blade 5oz', printName: '板腱加購 5oz', price: 200, category: 'Main Addons', isAvailable: true },
  { id: 'addon-ribeye-cap-5oz', name: 'Add Ribeye Cap 5oz', printName: '上蓋加購 5oz', price: 200, category: 'Main Addons', isAvailable: true },
  { id: 'addon-chicken-leg-5oz', name: 'Add Chicken Leg 5oz', printName: '雞腿加購 5oz', price: 120, category: 'Main Addons', isAvailable: true },
  { id: 'addon-sea-bass-5oz', name: 'Add Sea Bass 5oz', printName: '煎魚加購 5oz', price: 120, category: 'Main Addons', isAvailable: true },
  { id: 'addon-duck-breast-5oz', name: 'Add Duck Breast 5oz', printName: '鴨胸加購 5oz', price: 150, category: 'Main Addons', isAvailable: true },
  { id: 'addon-fried-fish-5oz', name: 'Add Fried Fish 5oz', printName: '炸魚加購 5oz', price: 120, category: 'Main Addons', isAvailable: true },
  { id: 'addon-pork-chop-5oz', name: 'Add Pork Chop 5oz', printName: '豬排加購 5oz', price: 120, category: 'Main Addons', isAvailable: true },
  { id: 'addon-jp-pork-cutlet-5oz', name: 'Add Pork Cutlet 5oz', printName: '日豬加購 5oz', price: 120, category: 'Main Addons', isAvailable: true },
  { id: 'addon-pasta', name: 'Add Pasta', printName: '義麵加購', price: 150, category: 'Main Addons', isAvailable: true },
  
  { id: 'addon-soup', name: 'Add Soup', printName: '湯品 加購', price: 30, category: 'Side Addons', isAvailable: true },
  { id: 'addon-congee', name: 'Add Congee', printName: '粥品 加購', price: 60, category: 'Side Addons', isAvailable: true },
  { id: 'addon-fries', name: 'Add Fries', printName: '脆薯 加購', price: 60, category: 'Side Addons', isAvailable: true },
  { id: 'addon-daily-dessert', name: 'Add Daily Dessert', printName: '是日甜品 加購', price: 60, category: 'Side Addons', isAvailable: true },
  { id: 'addon-drink-side', name: 'Add Drink', printName: '飲料 加購', price: 20, category: 'Side Addons', isAvailable: true },
  { id: 'addon-nuggets-side', name: 'Add Nuggets', printName: '雞塊 加購', price: 75, category: 'Side Addons', isAvailable: true },
  { id: 'addon-garlic-bread', name: 'Add Garlic Bread', printName: '蒜法 加購', price: 60, category: 'Side Addons', isAvailable: true },
  { id: 'addon-dessert-choice', name: 'Add Dessert Choice', printName: '任選甜品 加購', price: 99, category: 'Side Addons', isAvailable: true },
  
  { id: 'addon-simple-gold-fried-chicken', name: 'Add Crispy Chicken', printName: '黃金脆皮炸雞塊加購', price: 75, category: 'Simple Meal Addon', isAvailable: true },
  { id: 'addon-simple-kimchi-burger', name: 'Add Kimchi Burger', printName: '黃金泡菜脆皮雞塊吃到堡加購', price: 75, category: 'Simple Meal Addon', isAvailable: true },
  { id: 'addon-simple-waffle-apple-burger', name: 'Add Waffle Burger', printName: '華夫蘋果沙拉雞塊吃到堡加購', price: 75, category: 'Simple Meal Addon', isAvailable: true },
  { id: 'addon-simple-egg-salad-burger', name: 'Add Egg Salad Burger', printName: '蛋沙拉脆皮雞塊吃到堡加購', price: 75, category: 'Simple Meal Addon', isAvailable: true },
  { id: 'addon-simple-peanut-icecream-burger', name: 'Add Peanut Ice Cream Burger', printName: '波士頓花生冰淇淋吃到堡加購', price: 75, category: 'Simple Meal Addon', isAvailable: true },
  { id: 'addon-simple-chocolate-icecream-burger', name: 'Add Lava Choco Burger', printName: '溶岩巧克佐冰淇淋吃到堡加購', price: 75, category: 'Simple Meal Addon', isAvailable: true },
];

export const DONENESS_LEVELS = ['3分熟', '5分熟', '7分熟', '全熟'];
export const SAUCE_CHOICES = ["生蒜片", "黑胡椒", "泡菜", "巴薩米克醋", "蒜味醬", "橙汁醬", "椒鹽", "BBQ醬", "蕃茄醬", "泰式", "芥末", "哇沙米", "椒鹽粉"];
export const DRINK_CHOICES = ["無糖紅茶", "冰涼可樂"];
export const DESSERT_CHOICES_A = ["法式烤布蕾佐冰淇淋", "宇治紫米紅豆冰淇淋", "融岩巧克力佐冰淇淋", "阿薩斯蘋果佐冰淇淋", "烤焦糖布丁佐冰淇淋", "波士頓花生冰淇淋"];
export const DESSERT_CHOICES_B = ["蜜糖潛堡", "格子鬆餅", "美式鬆餅", "蜜糖吐司", "法式薄餅", "焦糖鍋巴", "蜜糖長棍", "香餅牛軋", "脆皮甜筒"];
export const PASTA_CHOICES_A = ['日豬/煎豬排天使義麵', '炸魚/煎魚天使義麵', '炸雞/雞肉天使義麵', '炒牛肉片天使義大利麵'];
export const PASTA_CHOICES_B = ['蕃茄索士', '青醬索士', '蒜油索士', '奶油索士', '海鮮索士', '黑椒索士', '肉醬索士', '沙茶索士'];
export const COLD_NOODLE_CHOICES = ["日式涼麵", "泰式涼麵", "沙茶涼麵", "蒜香涼麵", "金瓜涼麵", "巴薩米醋涼麵", "香葱涼麵", "凱撒涼麵", "橙汁涼麵", "黑胡椒涼麵", "台式涼麵", "BBQ涼麵"];
export const SIMPLE_MEAL_CHOICES = ["黃金脆皮炸雞塊", "黃金泡菜脆皮雞塊吃到堡", "華夫蘋果沙拉雞塊吃到堡", "蛋沙拉脆皮雞塊吃到堡", "波士頓花生冰淇淋吃到堡", "溶岩巧克佐冰淇淋吃到堡"];

export const DONENESS_LEVELS_EN = ['Rare', 'Medium Rare', 'Medium', 'Medium Well', 'Well Done'];
export const SAUCE_CHOICES_EN = ["Garlic Chips", "Black Pepper", "Kimchi", "Balsamic", "Garlic Sauce", "Orange Sauce", "Salt & Pepper", "BBQ", "Ketchup", "Thai", "Mustard", "Wasabi", "Pepper Salt"];
export const DRINK_CHOICES_EN = ["Black Tea", "Cola"];
export const DESSERT_CHOICES_A_EN = ["Crème Brûlée w/ Ice Cream", "Red Bean Ice Cream", "Lava Choco w/ Ice Cream", "Apple Ice Cream", "Caramel Pudding w/ Ice Cream", "Peanut Ice Cream"];
export const DESSERT_CHOICES_B_EN = ["Honey Sub", "Waffle", "Pancake", "Honey Toast", "Crepe", "Caramel Rice Crust", "Honey Baguette", "Nougat", "Crispy Cone"];
export const PASTA_CHOICES_A_EN = ['Pork Cutlet Pasta', 'Fried Fish Pasta', 'Chicken Pasta', 'Beef Pasta'];
export const PASTA_CHOICES_B_EN = ['Tomato Sauce', 'Pesto Sauce', 'Garlic Oil', 'Cream Sauce', 'Seafood Sauce', 'Black Pepper', 'Meat Sauce', 'Satay'];
export const COLD_NOODLE_CHOICES_EN = ["Japanese", "Thai", "Satay", "Garlic", "Pumpkin", "Balsamic", "Scallion", "Caesar", "Orange", "Black Pepper", "Taiwanese", "BBQ"];
export const SIMPLE_MEAL_CHOICES_EN = ["Crispy Fried Chicken", "Kimchi Chicken Burger", "Waffle Apple Salad Burger", "Egg Salad Chicken Burger", "Peanut Ice Cream Burger", "Lava Chocolate Ice Cream Burger"];

export const TRANSLATIONS = {
  zh: {
    title: "無名牛排",
    refresh: "重整頁面",
    searchOrder: "查詢訂單",
    shopClosed: "休息中",
    shopClosedDesc: "目前非營業時間，請稍後再試。",
    loading: "載入中...",
    welcomeTitle: "歡迎光臨 無名牛排",
    welcomeContent: [
      "＊ 本店採用自助點餐模式，請確認餐點內容後再提交。",
      "＊ 圖片僅供參考，實際餐點以現場供應為準。",
      "＊ 如有特殊飲食需求（過敏源等），請於備註欄位說明。",
      "＊ 提交訂單後，請至櫃檯結帳付款。"
    ],
    welcomeAgree: "開始點餐",
    guestCountTitle: "請問用餐人數？",
    guestCountConfirm: "確認人數",
    orderQueryTitle: "訂單查詢",
    orderIdPlaceholder: "輸入訂單編號",
    advancedSearch: "進階搜尋",
    hideAdvancedSearch: "收起進階搜尋",
    customerName: "顧客姓名",
    customerPhone: "顧客電話",
    dateRange: "日期範圍",
    to: "至",
    searchButton: "搜尋",
    searchResults: "搜尋結果",
    orderDetails: "訂單詳情",
    soldOut: "已售完",
    addToCart: "加入購物車",
    updateItem: "更新餐點",
    cartTitle: "購物車",
    cartEmpty: "購物車是空的",
    content: "餐點內容",
    total: "總金額",
    processing: "處理中...",
    checkout: "送出訂單",
    options: {
      doneness: "熟度",
      sauce: "醬料",
      drink: "飲料",
      required: "需選擇",
      portion: "份",
      selected: "已選",
      max: "最多選擇",
      dessertA: "甜品 A區",
      dessertB: "甜品 B區",
      pastaMain: "義麵主食",
      pastaSauce: "義麵醬料",
      addons: "加購項目",
      notes: "備註",
    }
  },
  en: {
    title: "No Name Steak",
    refresh: "Refresh",
    searchOrder: "Search Order",
    shopClosed: "Closed",
    shopClosedDesc: "We are currently closed. Please try again later.",
    loading: "Loading...",
    welcomeTitle: "Welcome to No Name Steak",
    welcomeContent: [
      "* Self-service ordering system.",
      "* Images are for reference only.",
      "* Please indicate allergies in notes.",
      "* Pay at counter after submitting."
    ],
    welcomeAgree: "Start Ordering",
    guestCountTitle: "Number of Guests?",
    guestCountConfirm: "Confirm",
    orderQueryTitle: "Order Lookup",
    orderIdPlaceholder: "Enter Order ID",
    advancedSearch: "Advanced Search",
    hideAdvancedSearch: "Hide Advanced Search",
    customerName: "Name",
    customerPhone: "Phone",
    dateRange: "Date Range",
    to: "to",
    searchButton: "Search",
    searchResults: "Search Results",
    orderDetails: "Order Details",
    soldOut: "Sold Out",
    addToCart: "Add to Cart",
    updateItem: "Update Item",
    cartTitle: "Cart",
    cartEmpty: "Cart is empty",
    content: "Items",
    total: "Total",
    processing: "Processing...",
    checkout: "Checkout",
    options: {
      doneness: "Doneness",
      sauce: "Sauce",
      drink: "Drink",
      required: "Required",
      portion: "portions",
      selected: "Selected",
      max: "Max",
      dessertA: "Dessert A",
      dessertB: "Dessert B",
      pastaMain: "Pasta",
      pastaSauce: "Sauce",
      addons: "Add-ons",
      notes: "Notes",
    }
  }
};