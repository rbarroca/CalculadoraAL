import { useEffect, useState } from 'react';

const KEY = 'al-cookie-consent';

declare global {
  interface Window {
    loadGA?: () => void;
  }
}

function lerEscolha(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function guardarEscolha(valor: 'granted' | 'denied') {
  try {
    localStorage.setItem(KEY, valor);
  } catch {
    // sem armazenamento disponível: a escolha vale só para esta visita
  }
}

export default function CookieBanner() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (lerEscolha() === null) setVisivel(true);
    const reabrir = () => setVisivel(true);
    window.addEventListener('al:cookie-settings', reabrir);
    return () => window.removeEventListener('al:cookie-settings', reabrir);
  }, []);

  function escolher(valor: 'granted' | 'denied') {
    guardarEscolha(valor);
    setVisivel(false);
    if (valor === 'granted') window.loadGA?.();
  }

  if (!visivel) return null;

  return (
    <div
      role="dialog"
      aria-label="Preferências de cookies"
      className="fixed bottom-0 inset-x-0 z-[60] bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center gap-4">
        <p className="text-sm text-gray-700 leading-relaxed flex-1">
          Usamos o Google Analytics, só com a sua autorização, para perceber que simuladores são mais usados.
          Os valores que introduz nos simuladores não são enviados para nenhum servidor.
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={() => escolher('denied')}
            className="px-5 py-2.5 text-sm font-semibold text-gray-900 border-2 border-gray-300 hover:border-gray-400 rounded-xl transition-colors"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => escolher('granted')}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-orange-700 hover:bg-orange-800 rounded-xl transition-colors"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
