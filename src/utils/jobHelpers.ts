import type { Job, JobFilters, JobStatus } from '../types/Job';
import { PROCESS_STATUSES } from './constants';

export function truncate(text: string, maxLength = 100): string {
  const cleaned = text.trim().replace(/\s+/g, ' ');
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength).trim()}…`;
}

export function filterJobs(jobs: Job[], filters: JobFilters): Job[] {
  const search = filters.search.trim().toLowerCase();

  let result = jobs.filter((job) => {
    const matchesSearch =
      !search ||
      job.titulo.toLowerCase().includes(search) ||
      job.empresa.toLowerCase().includes(search);

    const matchesEmpresa =
      !filters.empresa || job.empresa.toLowerCase() === filters.empresa.toLowerCase();

    const matchesStatus = filters.status === 'all' || job.status === filters.status;

    return matchesSearch && matchesEmpresa && matchesStatus;
  });

  result = [...result].sort((a, b) => {
    const aTime = a[filters.sortBy]?.toMillis?.() ?? 0;
    const bTime = b[filters.sortBy]?.toMillis?.() ?? 0;
    return bTime - aTime;
  });

  return result;
}

export function groupJobsByStatus(jobs: Job[]): Record<JobStatus, Job[]> {
  const grouped = {
    aplicar: [],
    aplicado: [],
    rh: [],
    tecnica: [],
    desafio: [],
    gestor: [],
    aprovado: [],
    reprovado: [],
  } as Record<JobStatus, Job[]>;

  for (const job of jobs) {
    grouped[job.status].push(job);
  }

  return grouped;
}

export function getJobStats(jobs: Job[]) {
  return {
    total: jobs.length,
    aplicadas: jobs.filter((j) => j.status === 'aplicado').length,
    emProcesso: jobs.filter((j) => PROCESS_STATUSES.includes(j.status)).length,
    aprovadas: jobs.filter((j) => j.status === 'aprovado').length,
    reprovadas: jobs.filter((j) => j.status === 'reprovado').length,
  };
}

export function getUniqueCompanies(jobs: Job[]): string[] {
  return [...new Set(jobs.map((j) => j.empresa).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR'),
  );
}

export function jobToExportable(job: Job) {
  return {
    titulo: job.titulo,
    empresa: job.empresa,
    link: job.link,
    descricao: job.descricao,
    status: job.status,
    tags: job.tags,
    observacoes: job.observacoes,
    faixaSalarial: job.faixaSalarial,
    localizacao: job.localizacao,
    prioridade: job.prioridade,
    dataCandidatura: job.dataCandidatura,
    feedback: job.feedback,
    createdAt: job.createdAt?.toDate?.()?.toISOString?.() ?? null,
    updatedAt: job.updatedAt?.toDate?.()?.toISOString?.() ?? null,
  };
}
