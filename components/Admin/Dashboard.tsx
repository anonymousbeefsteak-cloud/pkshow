import React from 'react';
import { SalesStats, Order } from '../../types';

interface DashboardProps {
    stats: SalesStats | null;
    orders: Order[];
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, orders }) => {
    const today = new Date().toLocaleDateString('zh-TW');
    const todaysOrders = orders.filter(o => new Date(o.createdAt).toLocaleDateString('zh-TW') === today);
    const todaysRevenue = todaysOrders.reduce((sum, o) => sum + (o.status !== '錯誤' ? o.totalPrice : 0), 0);
    const pendingCount = orders.filter(o => o.status === '待店長確認' || o.status === '待處理').length;

    if (!stats) return <div className="p-8 text-center text-slate-500">載入統計數據中...</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-green-500">
                    <h3 className="text-sm font-medium text-slate-500 uppercase">今日營業額</h3>
                    <p className="text-3xl font-bold text-slate-800 mt-2">${todaysRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500">
                    <h3 className="text-sm font-medium text-slate-500 uppercase">今日訂單數</h3>
                    <p className="text-3xl font-bold text-slate-800 mt-2">{todaysOrders.length} <span className="text-sm text-slate-400 font-normal">筆</span></p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-red-500">
                    <h3 className="text-sm font-medium text-slate-500 uppercase">待處理訂單</h3>
                    <p className={`text-3xl font-bold mt-2 ${pendingCount > 0 ? 'text-red-600' : 'text-slate-800'}`}>{pendingCount} <span className="text-sm text-slate-400 font-normal">筆</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96 overflow-y-auto">
                    <h3 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">熱銷商品 Top 10</h3>
                    <ul className="space-y-3">
                        {stats.popularItems.map((item, idx) => (
                            <li key={idx} className="flex justify-between items-center pb-2 border-b border-slate-50 last:border-0">
                                <div className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'}`}>{idx + 1}</span>
                                    <span className="text-slate-700 font-medium truncate max-w-[150px] sm:max-w-xs">{item.name}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-slate-800">{item.quantity} 份</span>
                                    <span className="text-xs text-slate-400">${item.revenue.toLocaleString()}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">近七日營收趨勢</h3>
                    <div className="space-y-4">
                        {stats.salesTrend.map((day, idx) => {
                                const maxRev = Math.max(...stats.salesTrend.map(d => d.revenue), 1);
                                const percent = (day.revenue / maxRev) * 100;
                                return (
                                <div key={idx} className="flex items-center gap-4">
                                    <span className="w-16 text-xs text-slate-500 font-mono">{day.date}</span>
                                    <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden relative">
                                        <div className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${percent}%` }}></div>
                                    </div>
                                    <span className="w-16 text-right text-xs font-bold text-slate-700">${day.revenue}</span>
                                </div>
                                )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};