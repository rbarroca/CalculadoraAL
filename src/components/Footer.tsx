import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4">Calculadora de Alojamento Local</h3>
            <p className="text-sm leading-relaxed">
              A ferramenta mais completa para simular a rentabilidade do seu alojamento local em Portugal.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-500" />
                <a href="mailto:info@calculadora-al.pt" className="hover:text-white transition-colors">
                  info@calculadora-al.pt
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-blue-500" />
                <a href="tel:+351210000000" className="hover:text-white transition-colors">
                  +351 210 000 000
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-blue-500 mt-0.5" />
                <span>Lisboa, Portugal</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>
            © {currentYear} Calculadora de Alojamento Local. Simulações baseadas em dados médios do mercado. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
