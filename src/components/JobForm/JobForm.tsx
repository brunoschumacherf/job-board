import { useEffect, useState, type KeyboardEvent } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import type { Job } from '../../types/Job';
import { JOB_STATUSES, LOCATION_TYPES, PRIORITIES, TECH_TAGS } from '../../types/Job';
import { LOCATION_LABELS, PRIORITY_LABELS, STATUS_LABELS } from '../../utils/constants';
import { jobFormSchema, type JobFormValues } from '../../utils/schemas';
import { cn } from '../../utils/cn';

interface JobFormProps {
  job?: Job | null;
  onSubmit: (values: JobFormValues) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

const defaultValues: JobFormValues = {
  titulo: '',
  empresa: '',
  link: '',
  descricao: '',
  tags: [],
  observacoes: '',
  faixaSalarial: '',
  localizacao: 'remoto',
  prioridade: 'media',
  dataCandidatura: null,
  feedback: '',
  status: 'aplicar',
};

export function JobForm({ job, onSubmit, onCancel, submitLabel = 'Salvar' }: JobFormProps) {
  const [customTag, setCustomTag] = useState('');
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues,
  });

  useEffect(() => {
    setCustomTag('');
    if (job) {
      reset({
        titulo: job.titulo,
        empresa: job.empresa,
        link: job.link,
        descricao: job.descricao,
        tags: job.tags,
        observacoes: job.observacoes,
        faixaSalarial: job.faixaSalarial,
        localizacao: job.localizacao,
        prioridade: job.prioridade,
        dataCandidatura: job.dataCandidatura,
        feedback: job.feedback,
        status: job.status,
      });
    } else {
      reset(defaultValues);
    }
  }, [job, reset]);

  const fieldClass =
    'w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20';

  return (
    <form
      id="job-form"
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Título *</label>
          <input
            {...register('titulo')}
            className={fieldClass}
            placeholder="Ex: Desenvolvedor Frontend"
          />
          {errors.titulo ? (
            <p className="mt-1 text-xs text-rose-500">{errors.titulo.message}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Empresa *</label>
          <input {...register('empresa')} className={fieldClass} placeholder="Ex: Acme Inc" />
          {errors.empresa ? (
            <p className="mt-1 text-xs text-rose-500">{errors.empresa.message}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Link</label>
          <input {...register('link')} className={fieldClass} placeholder="https://..." />
          {errors.link ? <p className="mt-1 text-xs text-rose-500">{errors.link.message}</p> : null}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Descrição *</label>
          <textarea
            {...register('descricao')}
            rows={4}
            className={cn(fieldClass, 'resize-y')}
            placeholder="Resumo da vaga, requisitos, stack…"
          />
          {errors.descricao ? (
            <p className="mt-1 text-xs text-rose-500">{errors.descricao.message}</p>
          ) : null}
        </div>

        {job ? (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Status</label>
            <select {...register('status')} className={fieldClass}>
              {JOB_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Localização</label>
          <select {...register('localizacao')} className={fieldClass}>
            {LOCATION_TYPES.map((loc) => (
              <option key={loc} value={loc}>
                {LOCATION_LABELS[loc]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Prioridade</label>
          <select {...register('prioridade')} className={fieldClass}>
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Faixa salarial</label>
          <input
            {...register('faixaSalarial')}
            className={fieldClass}
            placeholder="Ex: R$ 8.000 – R$ 12.000"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Data da candidatura
          </label>
          <input type="date" {...register('dataCandidatura')} className={fieldClass} />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Tecnologias</label>
          <Controller
            control={control}
            name="tags"
            render={({ field }) => {
              const selected = field.value ?? [];
              const customSelected = selected.filter(
                (tag) => !(TECH_TAGS as readonly string[]).includes(tag),
              );
              const suggestions = [...TECH_TAGS, ...customSelected];

              const toggleTag = (tag: string) => {
                const active = selected.includes(tag);
                field.onChange(active ? selected.filter((t) => t !== tag) : [...selected, tag]);
              };

              const addCustomTag = () => {
                const next = customTag.trim();
                if (!next) return;

                const exists = selected.some((tag) => tag.toLowerCase() === next.toLowerCase());
                if (!exists) {
                  field.onChange([...selected, next]);
                }
                setCustomTag('');
              };

              const onCustomKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addCustomTag();
                }
              };

              return (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((tag) => {
                      const active = selected.includes(tag);
                      const isCustom = !(TECH_TAGS as readonly string[]).includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={cn(
                            'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition',
                            active
                              ? 'border-accent bg-accent/10 text-accent'
                              : 'border-border text-muted hover:border-accent/40 hover:text-foreground',
                          )}
                        >
                          {tag}
                          {isCustom && active ? (
                            <X
                              className="h-3 w-3"
                              onClick={(e) => {
                                e.stopPropagation();
                                field.onChange(selected.filter((t) => t !== tag));
                              }}
                            />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      onKeyDown={onCustomKeyDown}
                      className={fieldClass}
                      placeholder="Criar tecnologia (ex: Rust, Kotlin…)"
                      maxLength={40}
                    />
                    <button
                      type="button"
                      onClick={addCustomTag}
                      disabled={!customTag.trim()}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted-bg disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar
                    </button>
                  </div>
                </div>
              );
            }}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Observações pessoais
          </label>
          <textarea
            {...register('observacoes')}
            rows={3}
            className={cn(fieldClass, 'resize-y')}
            placeholder="Notas internas, contatos, lembretes…"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Feedback recebido
          </label>
          <textarea
            {...register('feedback')}
            rows={3}
            className={cn(fieldClass, 'resize-y')}
            placeholder="Retornos do processo seletivo…"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted-bg"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-accent-hover disabled:opacity-60"
        >
          {isSubmitting ? 'Salvando…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
