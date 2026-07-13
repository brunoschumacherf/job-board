import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Copy, ExternalLink, MapPin, Pencil, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { MouseEvent } from 'react';
import { toast } from 'sonner';
import type { Job } from '../../types/Job';
import {
  LOCATION_LABELS,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
} from '../../utils/constants';
import { cn } from '../../utils/cn';
import { truncate } from '../../utils/jobHelpers';

interface JobCardProps {
  job: Job;
  onOpen: (job: Job) => void;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
  isDraggingOverlay?: boolean;
}

export function JobCard({
  job,
  onOpen,
  onEdit,
  onDelete,
  isDraggingOverlay = false,
}: JobCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: job.id,
    data: { job },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const updatedLabel = job.updatedAt?.toDate
    ? formatDistanceToNow(job.updatedAt.toDate(), { addSuffix: true, locale: ptBR })
    : 'agora';

  const copyLink = async (e: MouseEvent) => {
    e.stopPropagation();
    if (!job.link) {
      toast.error('Esta vaga não possui link');
      return;
    }
    try {
      await navigator.clipboard.writeText(job.link);
      toast.success('Link copiado');
    } catch {
      toast.error('Não foi possível copiar o link');
    }
  };

  const openLink = (e: MouseEvent) => {
    e.stopPropagation();
    if (!job.link) {
      toast.error('Esta vaga não possui link');
      return;
    }
    window.open(job.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <article
      ref={isDraggingOverlay ? undefined : setNodeRef}
      style={isDraggingOverlay ? undefined : style}
      {...(isDraggingOverlay ? {} : attributes)}
      {...(isDraggingOverlay ? {} : listeners)}
      onClick={() => onOpen(job)}
      className={cn(
        'group cursor-grab rounded-xl border border-border bg-surface p-3.5 shadow-sm transition active:cursor-grabbing',
        'hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md',
        (isDragging || isDraggingOverlay) && 'opacity-90 shadow-lg ring-2 ring-accent/30',
        isDragging && !isDraggingOverlay && 'opacity-40',
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">{job.titulo}</h3>
          <p className="mt-0.5 truncate text-xs text-muted">{job.empresa}</p>
        </div>
        <span
          className={cn(
            'shrink-0 text-[10px] font-semibold uppercase',
            PRIORITY_COLORS[job.prioridade],
          )}
        >
          {PRIORITY_LABELS[job.prioridade]}
        </span>
      </div>

      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted">
        {truncate(job.descricao, 90)}
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <span
          className={cn(
            'rounded-md px-1.5 py-0.5 text-[10px] font-medium',
            STATUS_COLORS[job.status].badge,
          )}
        >
          {STATUS_LABELS[job.status]}
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-muted-bg px-1.5 py-0.5 text-[10px] text-muted">
          <MapPin className="h-3 w-3" />
          {LOCATION_LABELS[job.localizacao]}
        </span>
        {job.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted"
          >
            {tag}
          </span>
        ))}
        {job.tags.length > 2 ? (
          <span className="text-[10px] text-muted">+{job.tags.length - 2}</span>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-muted">Atualizado {updatedLabel}</span>
        <div className="flex items-center gap-0.5 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
          <button
            type="button"
            onClick={openLink}
            className="rounded-lg p-1.5 text-muted transition hover:bg-muted-bg hover:text-foreground"
            title="Abrir link"
            aria-label="Abrir link"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={copyLink}
            className="rounded-lg p-1.5 text-muted transition hover:bg-muted-bg hover:text-foreground"
            title="Copiar link"
            aria-label="Copiar link"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(job);
            }}
            className="rounded-lg p-1.5 text-muted transition hover:bg-muted-bg hover:text-foreground"
            title="Editar"
            aria-label="Editar"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(job);
            }}
            className="rounded-lg p-1.5 text-muted transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
            title="Excluir"
            aria-label="Excluir"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
