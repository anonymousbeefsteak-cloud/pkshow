import React, { useRef } from 'react';
import { DownloadIcon, UploadIcon } from '../Icons';

interface SettingsProps {
    isQuietHours: boolean;
    onToggleQuiet: (val: boolean) => void;
    onBackup: () => void;
    onRestore: (file: File) => Promise<boolean>;
    onClear: () => Promise<boolean>;
}

export const Settings: React.FC<SettingsProps> = ({ isQuietHours, onToggleQuiet, onBackup, onRestore, onClear }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => { 
        const file = e.target.files?.[0]; 
        if (!file) return; 
        try { 
            await onRestore(file); 
            alert('資料還原成功！頁面將重新整理。'); 
            window.location.reload(); 
        } catch (err) { 
            alert('資料還原失敗，請確認檔案格式是否正確。'); 
        } 
    };
    
    const handleClear = async () => {
        if(confirm('確定要清除所有訂單資料嗎？(菜單設定保留)\n此動作無法復原！')) {
            await onClear();
            alert('資料已清除');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"><div className="flex items-center justify-between"><div><h3 className="font-bold text-slate-800 text-lg">店家休息模式 (Quiet Hours)</h3><p className="text-sm text-slate-500 mt-1">啟用後，前台點餐頁面將顯示「休息中」並停止接受新訂單。</p></div><button onClick={() => onToggleQuiet(!isQuietHours)} className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${isQuietHours ? 'bg-indigo-600' : 'bg-slate-300'}`}><span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isQuietHours ? 'translate-x-7' : 'translate-x-1'}`} /></button></div></div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"><h3 className="font-bold text-slate-800 text-lg mb-4">資料備份與還原</h3><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><button onClick={onBackup} className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-700"><DownloadIcon className="h-5 w-5"/> 備份資料 (JSON)</button><div className="relative"><input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" /><button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-700"><UploadIcon className="h-5 w-5"/> 還原資料</button></div></div></div>
            <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-100"><h3 className="font-bold text-red-800 text-lg mb-2">危險區域</h3><p className="text-sm text-red-600 mb-4">清除所有訂單資料（包含營收統計）。建議在每月結算備份後執行。</p><button onClick={handleClear} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">清除所有訂單資料</button></div>
        </div>
    );
};