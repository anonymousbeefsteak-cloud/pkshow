import React from 'react';

interface WelcomeModalProps {
  onAgree: () => void;
  t: any;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onAgree, t }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}><div className="p-6"><h2 className="text-2xl font-bold text-slate-800 text-center mb-4">{t.welcomeTitle}</h2><div className="text-slate-600 space-y-3 my-6">{t.welcomeContent.map((line: string, index: number) => (<p key={index}>{line}</p>))}</div></div><footer className="px-6 pb-6"><button onClick={onAgree} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-lg">{t.welcomeAgree}</button></footer></div>
    </div>
);

export default WelcomeModal;
