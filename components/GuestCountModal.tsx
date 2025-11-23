import React, { useState } from 'react';
import { PlusIcon, MinusIcon } from './Icons';

interface GuestCountModalProps {
  onConfirm: (count: number) => void;
  t: any;
}

const GuestCountModal: React.FC<GuestCountModalProps> = ({ onConfirm, t }) => {
    const [count, setCount] = useState(1);
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-xs" onClick={e => e.stopPropagation()}><div className="p-6 text-center"><h2 className="text-2xl font-bold text-slate-800 mb-4">{t.guestCountTitle}</h2><div className="flex items-center justify-center gap-4 my-6"><button onClick={() => setCount(c => Math.max(1, c - 1))} className="p-3 rounded-full bg-slate-200 hover:bg-slate-300"><MinusIcon className="h-6 w-6" /></button><input type="number" value={count} onChange={e => setCount(Math.max(1, parseInt(e.target.value, 10) || 1))} className="w-24 text-center text-4xl font-bold border-b-2 border-slate-300 focus:border-green-500 outline-none" min="1" /><button onClick={() => setCount(c => c + 1)} className="p-3 rounded-full bg-slate-200 hover:bg-slate-300"><PlusIcon className="h-6 w-6" /></button></div></div><footer className="px-6 pb-6"><button onClick={() => { if(count>0) onConfirm(count); }} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-lg">{t.guestCountConfirm}</button></footer></div>
        </div>
    );
};

export default GuestCountModal;
