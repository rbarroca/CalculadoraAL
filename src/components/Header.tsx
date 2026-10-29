import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { FERRAMENTAS } from '../data/ferramentas';

const normalizar = (p: string) => (p.length > 1 ? p.replace(/\/$/, '') : p);

export default function Header() {
  const { pathname } = useLocation();
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const botao = useRef<HTMLButtonElement>(null);
  const atual = normalizar(pathname);

  useEffect(() => setAberto(false), [pathname]);

  useEffect(() => {
    if (!aberto) return;
    const fora = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setAberto(false);
      botao.current?.focus();
    };
    document.addEventListener('mousedown', fora);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', fora);
      document.removeEventListener('keydown', esc);
    };
  }, [aberto]);

  return (
    <>
      <a href={atual === '/' ? '#calculator' : '#calculadora'} className="skip-link">
        Saltar para o calculador
      </a>
      <header className="border-b border-gray-200 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 min-w-0" aria-label="Calculadora de Alojamento Local, página inicial">
            <div className="bg-gradient-to-br from-orange-400 to-red-500 p-2.5 rounded-xl shadow-lg shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" className="text-white" aria-hidden="true">
                <g fill="currentColor">
                  <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                  <path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
                </g>
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-base sm:text-xl font-bold text-gray-900 tracking-tight leading-tight">Calculadora de Alojamento Local</p>
              <p className="hidden sm:block text-sm text-gray-600 font-medium mt-0.5">Simulador de Rentabilidade</p>
            </div>
          </Link>

          <div className="relative shrink-0" ref={ref}>
            <button
              ref={botao}
              type="button"
              onClick={() => setAberto(v => !v)}
              aria-expanded={aberto}
              aria-controls="menu-ferramentas"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-300 hover:border-orange-500 text-sm font-semibold text-gray-900 transition-colors"
            >
              Ferramentas
              <ChevronDown className={`h-4 w-4 transition-transform ${aberto ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {/* Sempre no HTML (escondido quando fechado) para as ligações existirem em todas as páginas */}
            <nav
                id="menu-ferramentas"
                aria-label="Ferramentas"
                hidden={!aberto}
                className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] bg-white rounded-2xl border border-gray-200 shadow-xl p-2"
              >
                {FERRAMENTAS.map(({ to, icon: Icon, nome, pergunta }) => {
                  const ativa = normalizar(to) === atual;
                  return (
                    <Link
                      key={to}
                      to={to}
                      aria-current={ativa ? 'page' : undefined}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-colors ${ativa ? 'bg-orange-50' : 'hover:bg-gray-50'}`}
                    >
                      <span className="bg-gradient-to-br from-orange-100 to-red-100 p-2 rounded-lg shrink-0">
                        <Icon className="h-5 w-5 text-orange-700" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className={`block text-sm font-semibold ${ativa ? 'text-orange-700' : 'text-gray-900'}`}>{nome}</span>
                        <span className="block text-xs text-gray-600">{pergunta}</span>
                      </span>
                    </Link>
                  );
                })}
              </nav>
          </div>
        </div>
      </header>
    </>
  );
}
