import React, { useState, useEffect } from 'react';
import { CalendarIcon } from '../Icons';
import { apiService } from '../../services/apiService';

export const SalesReports: React.FC = () => {
    const [activeReport, setActiveReport] = useState<'daily' | 'monthly'>('daily');
    const [date, setDate] = useState(() => { const now = new Date(); return now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0'); });
    const [month, setMonth] = useState(() => { const now = new Date(); return now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0'); });
    const [reportData, setReportData] = useState<any>(null);

    useEffect(() => { loadData(); }, [activeReport, date, month]);
    
    const loadData = async () => { 
        if(activeReport === 'daily') { 
            const data = await apiService.getDailySales(date); 
            setReportData(data); 
        } else { 
            const data = await apiService.getMonthlySales(month); 
            setReportData(data); 
        } 
    };

    return ( 
        <div className="space-y-6"> 
            <div className="flex gap-4 border-b border-slate-200 pb-4"> 
                <button onClick={() => setActiveReport('daily')} className={`px-4 py-2 rounded-lg font-bold ${activeReport === 'daily' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>日營收報表</button> 
                <button onClick={() => setActiveReport('monthly')} className={`px-4 py-2 rounded-lg font-bold ${activeReport === 'monthly' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>月營收報表</button> 
            </div> 
            {activeReport === 'daily' && ( 
                <div className="space-y-6 animate-fade-in"> 
                    <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow-sm inline-flex">
                        <CalendarIcon className="text-slate-500" />
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="outline-none font-bold text-slate-700" />
                    </div> 
                    {reportData && ( 
                        <> 
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> 
                                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                    <h4 className="text-green-800 text-sm font-bold">總營收</h4>
                                    <p className="text-3xl font-bold text-green-700">${reportData.totalRevenue}</p>
                                </div> 
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <h4 className="text-blue-800 text-sm font-bold">總訂單</h4>
                                    <p className="text-3xl font-bold text-blue-700">{reportData.orderCount} 筆</p>
                                </div> 
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                    <h4 className="text-purple-800 text-sm font-bold">平均客單價</h4>
                                    <p className="text-3xl font-bold text-purple-700">${reportData.avgOrderValue}</p>
                                </div> 
                            </div> 
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"> 
                                <div className="px-6 py-4 bg-slate-50 border-b font-bold text-slate-700">銷售品項明細</div> 
                                <table className="w-full text-left"> 
                                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                                        <tr>
                                            <th className="px-6 py-3">品項名稱</th>
                                            <th className="px-6 py-3 text-right">數量</th>
                                            <th className="px-6 py-3 text-right">小計</th>
                                        </tr>
                                    </thead> 
                                    <tbody className="divide-y divide-slate-100">
                                        {reportData.breakdown.map((item: any, idx: number) => (
                                            <tr key={idx} className="hover:bg-slate-50">
                                                <td className="px-6 py-3 font-medium text-slate-700">{item.name}</td>
                                                <td className="px-6 py-3 text-right text-slate-600">{item.quantity}</td>
                                                <td className="px-6 py-3 text-right font-bold text-slate-800">${item.total}</td>
                                            </tr>
                                        ))}
                                    </tbody> 
                                </table> 
                            </div> 
                        </> 
                    )} 
                </div> 
            )} 
            {activeReport === 'monthly' && ( 
                <div className="space-y-6 animate-fade-in"> 
                    <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow-sm inline-flex">
                        <CalendarIcon className="text-slate-500" />
                        <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="outline-none font-bold text-slate-700" />
                    </div> 
                    {reportData && ( 
                        <> 
                            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 text-center">
                                <h4 className="text-indigo-800 font-bold mb-2">本月總營收</h4>
                                <p className="text-5xl font-black text-indigo-700">${reportData.totalRevenue.toLocaleString()}</p>
                            </div> 
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"> 
                                <h3 className="font-bold text-slate-700 mb-6">每日營收走勢</h3> 
                                <div className="flex items-end gap-1 h-64"> 
                                    {reportData.dailyTrend.map((d: any, idx: number) => { 
                                        const maxVal = Math.max(...reportData.dailyTrend.map((x: any) => x.revenue), 1); 
                                        const height = (d.revenue / maxVal) * 100; 
                                        return ( 
                                            <div key={idx} className="flex-1 flex flex-col items-center group relative"> 
                                                <div className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all" style={{ height: `${height}%` }}></div> 
                                                <span className="text-xs text-slate-400 mt-1">{d.day}</span> 
                                                <div className="absolute bottom-full mb-2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">${d.revenue}</div> 
                                            </div> 
                                        ) 
                                    })} 
                                </div> 
                            </div> 
                        </> 
                    )} 
                </div> 
            )} 
        </div> 
    );
};
