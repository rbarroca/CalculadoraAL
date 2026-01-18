import React from 'react';
import { Home } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-gray-200 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-400 to-red-500 p-2.5 rounded-lg shadow-lg">
            <Home className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AL Calculator</h1>
            <p className="text-sm text-gray-600 font-medium">Simulador de Rentabilidade</p>
          </div>
        </div>
      </div>
    </header>
  );
}
