import type { Timestamp } from 'firebase/firestore';

export const JOB_STATUSES = [
  'aplicar',
  'aplicado',
  'rh',
  'tecnica',
  'desafio',
  'gestor',
  'aprovado',
  'reprovado',
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const LOCATION_TYPES = ['remoto', 'hibrido', 'presencial'] as const;
export type LocationType = (typeof LOCATION_TYPES)[number];

export const PRIORITIES = ['alta', 'media', 'baixa'] as const;
export type Priority = (typeof PRIORITIES)[number];

export const TECH_TAGS = [
  'React',
  'TypeScript',
  'JavaScript',
  'Node',
  'Ruby',
  'Java',
  'Python',
  'Go',
  'PHP',
  'Vue',
  'Angular',
  'Next.js',
  'NestJS',
  'AWS',
  'Docker',
  'SQL',
  'MongoDB',
  'GraphQL',
] as const;

export type TechTag = (typeof TECH_TAGS)[number];

export interface Job {
  id: string;
  titulo: string;
  empresa: string;
  link: string;
  descricao: string;
  status: JobStatus;
  tags: string[];
  observacoes: string;
  faixaSalarial: string;
  localizacao: LocationType;
  prioridade: Priority;
  dataCandidatura: string | null;
  feedback: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type JobInput = Omit<Job, 'id' | 'createdAt' | 'updatedAt'>;

export type CreateJobData = Omit<JobInput, 'status'> & {
  status?: JobStatus;
};

export type UpdateJobData = Partial<JobInput>;

export type SortOption = 'createdAt' | 'updatedAt';

export interface JobFilters {
  search: string;
  empresa: string;
  status: JobStatus | 'all';
  sortBy: SortOption;
}
