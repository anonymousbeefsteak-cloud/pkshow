import React, { useState, useMemo } from 'react';
import { Order } from '../../types';
import { DownloadIcon } from '../Icons';

interface OrderManagerProps {
    orders: Order[];
    onStatusUpdate: (id: string, status: string) => void;
}

export const OrderManager: React.FC<OrderManagerProps> = ({ orders, onStatusUpdate }) => {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredOrders = useMemo(() => {
        let result = orders;
        if (filter === 'pending') result = orders.filter(o => o.status === '待店長確認' || o.status === '待處理');
        else if (filter === 'active') result = orders.filter(o => o.status === '製作中' || o.status === '可以取餐');
        else if (filter === 'completed') result = orders.filter(o => o.status === '已完成');

        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(o => 
                o.id.toLowerCase().includes(lower) || 
                o.customerInfo.name.toLowerCase().includes(lower) || 
                o.customerInfo.phone.includes(lower)
            );
        }
        return result;
    }, [orders, filter, searchTerm]);

    const statusColors: any = {
        '待店長確認': 'bg-red-100 text-red-700 border-red-200',
        '待處理': 'bg-orange-100 text-orange-700 border-orange-200',
        '製作中': 'bg-blue-100 text-blue-700 border-blue-200',
        '可以取餐': 'bg-green-100 text-green-700 border-green-200',
        '已完成': 'bg-slate-100 text-slate-600 border-slate-200',
        '錯誤': 'bg-gray-200 text-gray-500 border-gray-300 line-through'
    };

    const downloadCSV = () => {
        const headers = ['訂單編號', '時間', '顧客姓名', '電話', '桌號', '總金額', '狀態', '內容摘要'];
        const rows = filteredOrders.map(o => [
            o.id,
            new Date(o.createdAt).toLocaleString('zh-TW'),
            o.customerInfo.name,
            o.customerInfo.phone,
            o.customerInfo.tableNumber || '外帶',
            o.totalPrice,
            o.status,
            o.items.map(i => `${i.item.name} x${i.quantity}`).join('; ')
        ]);
        const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `orders_export.csv`; a.click();
    };

    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex bg-white rounded-lg shadow-sm p-1 border border-slate-200">
                    <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>全部</button>
                    <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'pending' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>待處理</button>
                    <button onClick={() => setFilter('active')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'active' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>進行中</button>
                    <button onClick={() => setFilter('completed')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'completed' ? 'bg-green-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>已完成</button>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <input type="text" placeholder="搜尋單號/姓名/電話" className="px-3 py-2 border rounded-md text-sm w-full md:w-64" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    <button onClick={downloadCSV} className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 whitespace-nowrap"><DownloadIcon className="h-4 w-4"/> 匯出 CSV</button>
                </div>
            </div>
            <div className="flex-1 overflow-auto bg-white rounded-xl shadow-sm border border-slate-200">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10"><tr><th className="p-4 font-medium text-slate-500 text-sm">時間 / 單號</th><th className="p-4 font-medium text-slate-500 text-sm">顧客 / 桌號</th><th className="p-4 font-medium text-slate-500 text-sm">內容摘要</th><th className="p-4 font-medium text-slate-500 text-sm">總金額</th><th className="p-4 font-medium text-slate-500 text-sm">狀態</th><th className="p-4 font-medium text-slate-500 text-sm text-right">操作</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredOrders.map(order => (
                            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 align-top whitespace-nowrap"><div className="font-mono font-bold text-slate-700">{order.id.slice(-6)}</div><div className="text-xs text-slate-400 mt-1">{new Date(order.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div></td>
                                <td className="p-4 align-top whitespace-nowrap"><div className="font-medium text-slate-800">{order.customerInfo.name}</div><div className="text-xs text-slate-500">{order.orderType} {order.customerInfo.tableNumber ? `(${order.customerInfo.tableNumber})` : ''}</div><div className="text-xs text-slate-400">{order.customerInfo.phone}</div></td>
                                <td className="p-4 align-top max-w-xs"><ul className="text-sm text-slate-600 space-y-1">{order.items.map((item, i) => (<li key={i} className="truncate">{item.item.name.replace(/套餐|半全餐/g, '')} x{item.quantity}</li>))}</ul></td>
                                <td className="p-4 align-top font-bold text-slate-700">${order.totalPrice}</td>
                                <td className="p-4 align-top"><span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[order.status] || 'bg-slate-100'}`}>{order.status}</span></td>
                                <td className="p-4 align-top text-right"><select value={order.status} onChange={(e) => onStatusUpdate(order.id, e.target.value)} className="bg-white border border-slate-300 text-slate-700 text-sm rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"><option value="待店長確認">待確認</option><option value="待處理">待處理</option><option value="製作中">製作中</option><option value="可以取餐">可取餐</option><option value="已完成">已完成</option><option value="錯誤">取消/錯誤</option></select></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};