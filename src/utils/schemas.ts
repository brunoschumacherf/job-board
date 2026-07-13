import { z } from 'zod';
import { JOB_STATUSES, LOCATION_TYPES, PRIORITIES } from '../types/Job';

export const jobFormSchema = z.object({
  titulo: z.string().trim().min(2, 'Informe o título da vaga'),
  empresa: z.string().trim().min(2, 'Informe a empresa'),
  link: z
    .string()
    .trim()
    .refine((value) => value === '' || URL.canParse(value), {
      message: 'Informe um link válido',
    }),
  descricao: z.string().trim().min(10, 'Descreva a vaga com pelo menos 10 caracteres'),
  tags: z.array(z.string()),
  observacoes: z.string(),
  faixaSalarial: z.string(),
  localizacao: z.enum(LOCATION_TYPES),
  prioridade: z.enum(PRIORITIES),
  dataCandidatura: z
    .string()
    .nullable()
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null)),
  feedback: z.string(),
  status: z.enum(JOB_STATUSES).optional(),
});

export type JobFormValues = z.input<typeof jobFormSchema>;

export const importJobSchema = z.object({
  titulo: z.string().min(1),
  empresa: z.string().min(1),
  link: z.string().optional().default(''),
  descricao: z.string().optional().default(''),
  status: z.enum(JOB_STATUSES).optional(),
  tags: z.array(z.string()).optional(),
  observacoes: z.string().optional(),
  faixaSalarial: z.string().optional(),
  localizacao: z.enum(LOCATION_TYPES).optional(),
  prioridade: z.enum(PRIORITIES).optional(),
  dataCandidatura: z.string().nullable().optional(),
  feedback: z.string().optional(),
});

export const importJobsSchema = z.array(importJobSchema);
