import { Calculator, FileText, Landmark, TrendingUp, BarChart2 } from 'lucide-react';

export interface Ferramenta {
  to: string;
  icon: typeof Calculator;
  nome: string;
  pergunta: string;
}

export const FERRAMENTAS: Ferramenta[] = [
  { to: '/', icon: Calculator, nome: 'Calculadora de Rentabilidade', pergunta: 'Quanto rende o meu AL?' },
  { to: '/imt/', icon: Landmark, nome: 'Simulador de IMT', pergunta: 'Quanto pago de IMT na compra?' },
  { to: '/impostos/', icon: FileText, nome: 'Simulador de Impostos AL', pergunta: 'Quanto pago de IRS e IVA?' },
  { to: '/mais-valias/', icon: TrendingUp, nome: 'Simulador de Mais-Valias', pergunta: 'Quanto pago se vender?' },
  { to: '/taxa-ocupacao/', icon: BarChart2, nome: 'Taxa de Ocupação', pergunta: 'A minha ocupação é boa?' },
];
