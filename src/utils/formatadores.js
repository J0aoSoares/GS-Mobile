import { TEMPO } from '../constants/limiares';
import { apenasDigitos } from './validadores';

// Formatação para exibição. Feita à mão para não depender de Intl no Hermes.

const doisDigitos = (n) => String(n).padStart(2, '0');

export function formatarHora(iso) {
  if (!iso) return '--:--';
  const d = new Date(iso);
  return `${doisDigitos(d.getHours())}:${doisDigitos(d.getMinutes())}`;
}

export function formatarData(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${doisDigitos(d.getDate())}/${doisDigitos(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function formatarDataHora(iso) {
  if (!iso) return '';
  return `${formatarData(iso)} às ${formatarHora(iso)}`;
}

// 1.234 → "1,2"
export function formatarLux(lux) {
  if (lux === null || lux === undefined || Number.isNaN(Number(lux))) return '--';
  return Number(lux).toFixed(1).replace('.', ',');
}

export function formatarCPF(cpf) {
  const d = apenasDigitos(cpf);
  if (d.length !== 11) return d;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

// Mostra só o meio do CPF: ***.456.789-**
export function mascararCPFParcial(cpf) {
  const d = apenasDigitos(cpf);
  if (d.length !== 11) return '***.***.***-**';
  return `***.${d.slice(3, 6)}.${d.slice(6, 9)}-**`;
}

export function formatarTelefone(tel) {
  const d = apenasDigitos(tel);
  if (d.length !== 11) return d;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function formatarCEP(cep) {
  const d = apenasDigitos(cep);
  if (d.length !== 8) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

// "há 5 min", "há 3 h", "há 2 dias"
export function tempoDecorrido(iso, agora = Date.now()) {
  if (!iso) return '';
  const diff = Math.max(0, agora - new Date(iso).getTime());
  if (diff < TEMPO.MS_POR_MINUTO) return 'agora mesmo';
  if (diff < TEMPO.MS_POR_HORA) return `há ${Math.floor(diff / TEMPO.MS_POR_MINUTO)} min`;
  const horas = Math.floor(diff / TEMPO.MS_POR_HORA);
  if (horas < TEMPO.HORAS_POR_DIA) return `há ${horas} h`;
  const dias = Math.floor(horas / TEMPO.HORAS_POR_DIA);
  return dias === 1 ? 'há 1 dia' : `há ${dias} dias`;
}

export function primeiroNome(nome) {
  return String(nome ?? '').trim().split(/\s+/)[0] || '';
}

// Saudação pela hora do dia.
export function saudacao(data = new Date()) {
  const h = data.getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}
