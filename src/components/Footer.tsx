import { Link } from 'react-router-dom';
import { Calculator, ExternalLink } from 'lucide-react';
import { FERRAMENTAS } from '../data/ferramentas';

/*
 * Footer partilhado pelos sites do portefólio de Alojamento Local.
 * O layout é fixo (marca + 2 colunas de ligações + linha de direitos + aviso). Só muda o conteúdo abaixo.
 * Especificação: docs/FOOTER-SPEC.md
 */
const MARCA = {
  nome: 'Calculadora de Alojamento Local',
  dominio: 'calculadoraal.pt',
  descricao: 'Simuladores gratuitos de rentabilidade, impostos, IMT e mais-valias para quem tem ou quer ter Alojamento Local em Portugal.',
  icone: Calculator,
  corIcone: 'from-orange-400 to-red-500',
};

interface Ligacao {
  label: string;
  to?: string;
  href?: string;
  icon?: typeof Calculator;
}

const COLUNAS: { titulo: string; ligacoes: Ligacao[] }[] = [
  {
    titulo: 'Ferramentas',
    ligacoes: FERRAMENTAS.map(({ to, nome, icon }) => ({ label: nome, to, icon })),
  },
  {
    titulo: 'Links úteis',
    ligacoes: [
      { label: 'Guia de Alojamento Local', href: 'https://tudosobrealojamentolocal.pt', icon: ExternalLink },
      { label: 'Find a Manager AL', href: 'https://findamanageral.com', icon: ExternalLink },
    ],
  },
];

const linkClass = 'inline-flex items-center gap-2 py-1 text-sm text-gray-600 hover:text-orange-600 transition-colors';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const Icone = MARCA.icone;

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link to="/" className="inline-flex items-center gap-3" aria-label={`${MARCA.nome}, página inicial`}>
              <span className={`bg-gradient-to-br ${MARCA.corIcone} p-2.5 rounded-xl shadow-sm`}>
                <Icone className="h-5 w-5 text-white" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-lg font-bold text-gray-900 leading-tight">{MARCA.nome}</span>
                <span className="block text-sm text-gray-600">{MARCA.dominio}</span>
              </span>
            </Link>
            <p className="mt-5 text-sm text-gray-600 leading-relaxed max-w-sm">{MARCA.descricao}</p>
          </div>

          {COLUNAS.map(({ titulo, ligacoes }) => (
            <nav key={titulo} aria-label={titulo}>
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">{titulo}</h2>
              <ul className="space-y-3">
                {ligacoes.map(({ label, to, href, icon: Icon }) => (
                  <li key={label}>
                    {to ? (
                      <Link to={to} className={linkClass}>
                        {Icon && <Icon className="h-4 w-4 text-gray-500" aria-hidden="true" />}
                        {label}
                      </Link>
                    ) : (
                      <a href={href} className={linkClass}>
                        {Icon && <Icon className="h-4 w-4 text-gray-500" aria-hidden="true" />}
                        {label}
                      </a>
                    )}
                  </li>
                ))}
                {titulo === 'Links úteis' && (
                  <li>
                    <button
                      type="button"
                      onClick={() => window.dispatchEvent(new Event('al:cookie-settings'))}
                      className={`${linkClass} underline-offset-2 hover:underline`}
                    >
                      Preferências de cookies
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 space-y-3 text-center">
          <p className="text-sm text-gray-600">
            © {currentYear} {MARCA.nome}. Todos os direitos reservados. | {MARCA.dominio}
          </p>
          <p className="text-xs text-gray-600 leading-relaxed max-w-3xl mx-auto">
            As simulações são indicativas, baseadas em dados médios e na legislação em vigor, e não constituem aconselhamento fiscal, jurídico ou financeiro. Consulte um contabilista certificado para a sua situação.
          </p>
        </div>
      </div>
    </footer>
  );
}
