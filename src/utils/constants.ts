import type { JobStatus, LocationType, Priority } from '../types/Job';

export const STATUS_LABELS: Record<JobStatus, string> = {
  aplicar: 'Aplicar',
  aplicado: 'Aplicado',
  rh: 'Entrevista RH',
  tecnica: 'Entrevista Técnica',
  desafio: 'Desafio Técnico',
  gestor: 'Entrevista Gestor',
  aprovado: 'Aprovado',
  reprovado: 'Reprovado',
};

export const STATUS_COLORS: Record<JobStatus, { header: string; badge: string; chart: string }> = {
  aplicar: {
    header: 'bg-sky-500',
    badge: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
    chart: '#0ea5e9',
  },
  aplicado: {
    header: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    chart: '#3b82f6',
  },
  rh: {
    header: 'bg-violet-500',
    badge: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
    chart: '#8b5cf6',
  },
  tecnica: {
    header: 'bg-indigo-500',
    badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
    chart: '#6366f1',
  },
  desafio: {
    header: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    chart: '#f59e0b',
  },
  gestor: {
    header: 'bg-orange-500',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
    chart: '#f97316',
  },
  aprovado: {
    header: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    chart: '#10b981',
  },
  reprovado: {
    header: 'bg-rose-500',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
    chart: '#f43f5e',
  },
};

export const LOCATION_LABELS: Record<LocationType, string> = {
  remoto: 'Remoto',
  hibrido: 'Híbrido',
  presencial: 'Presencial',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  alta: 'text-rose-600 dark:text-rose-400',
  media: 'text-amber-600 dark:text-amber-400',
  baixa: 'text-slate-500 dark:text-slate-400',
};

export const PROCESS_STATUSES: JobStatus[] = ['rh', 'tecnica', 'desafio', 'gestor'];

export const THEME_STORAGE_KEY = 'job-board-theme';
export const COLLECTION_JOBS = 'jobs';
