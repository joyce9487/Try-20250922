
import React from 'react';
import { LotusIcon } from './icons/LotusIcon';

export const Header: React.FC = () => (
  <header className="text-center w-full">
    <div className="flex justify-center items-center gap-4 mb-4">
      <LotusIcon className="w-12 h-12 text-teal-500" />
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
        專屬正念冥想引導
      </h1>
    </div>
    <p className="text-md md:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
      請描述您當下的心情或需求，AI 將為您生成一段客製化的冥想引導，幫助您回歸內心的寧靜。
    </p>
  </header>
);
