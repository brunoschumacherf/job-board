import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Copy, ExternalLink, MapPin, Pencil, Trash2, Wallet } from 'lucide-react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import type { Job } from '../../types/Job';
import {
  LOCATION_LABELS,
  PRIORITY_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
} from '../../utils/constants';
import { cn } from '../../utils/cn';
import { Modal } from '../Modal/Modal';

interface JobDetailModalProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
}

export function JobDetailModal({ job, open, onClose, onEdit, onDelete }: JobDetailModalProps) {
  if (!job) return null;

  const createdAt = job.createdAt?.toDate?.();
  const updatedAt = job.updatedAt?.toDate?.();

  const copyLink = async () => {
    if (!job.link) {
      toast.error('Esta vaga não possui link');
      return;
    }
    await navigator.clipboard.writeText(job.link);
    toast.success('Link copiado');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={job.titulo}
      size="xl"
      footer={
        <div className="flex flex-wrap justify-between gap-2">
          <div className="flex gap-2">
            {job.link ? (
              <>
                <button
                  type="button"
                  onClick={() => window.open(job.link, '_blank', 'noopener,noreferrer')}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted-bg"
                >
                  <ExternalLink className="h-4 w-4" />
                  Abrir link
                </button>
                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted-bg"
                >
                  <Copy className="h-4 w-4" />
                  Copiar link
                </button>
              </>
            ) : null}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(job);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
            >
              <Pencil className="h-4 w-4" />
              Editar
            </button>
            <button
              type="button"
              onClick={() => onDelete(job)}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/40"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-medium text-foreground">{job.empresa}</span>
          <span
            className={cn(
              'rounded-md px-2 py-0.5 text-xs font-medium',
              STATUS_COLORS[job.status].badge,
            )}
          >
            {STATUS_LABELS[job.status]}
          </span>
          <span className="rounded-md bg-muted-bg px-2 py-0.5 text-xs text-muted">
            Prioridade {PRIORITY_LABELS[job.prioridade]}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Meta
            icon={<MapPin className="h-4 w-4" />}
            label="Localização"
            value={LOCATION_LABELS[job.localizacao]}
          />
          <Meta
            icon={<Wallet className="h-4 w-4" />}
            label="Faixa salarial"
            value={job.faixaSalarial || 'Não informado'}
          />
          <Meta
            icon={<Calendar className="h-4 w-4" />}
            label="Candidatura"
            value={
              job.dataCandidatura
                ? format(new Date(job.dataCandidatura), 'dd/MM/yyyy', { locale: ptBR })
                : 'Não informada'
            }
          />
        </div>

        <Section title="Descrição">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">{job.descricao}</p>
        </Section>

        {job.tags.length > 0 ? (
          <Section title="Tecnologias">
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-border bg-surface-secondary px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Section>
        ) : null}

        {job.observacoes ? (
          <Section title="Observações pessoais">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">
              {job.observacoes}
            </p>
          </Section>
        ) : null}

        {job.feedback ? (
          <Section title="Feedback recebido">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">{job.feedback}</p>
          </Section>
        ) : null}

        <div className="rounded-xl border border-border bg-surface-secondary/50 px-4 py-3 text-xs text-muted">
          {createdAt ? (
            <p>Criada em {format(createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
          ) : null}
          {updatedAt ? (
            <p className="mt-1">
              Última atualização {formatDistanceToNow(updatedAt, { addSuffix: true, locale: ptBR })}{' '}
              ({format(updatedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })})
            </p>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </section>
  );
}

function Meta({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-secondary/40 p-3">
      <div className="mb-1 flex items-center gap-1.5 text-muted">
        {icon}
        <span className="text-[11px] font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
