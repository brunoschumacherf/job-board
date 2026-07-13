import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Job, JobStatus } from '../../types/Job';
import { STATUS_COLORS, STATUS_LABELS } from '../../utils/constants';
import { cn } from '../../utils/cn';
import { JobCard } from '../JobCard/JobCard';

interface ColumnProps {
  status: JobStatus;
  jobs: Job[];
  onOpen: (job: Job) => void;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
}

export function Column({ status, jobs, onOpen, onEdit, onDelete }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section
      className={cn(
        'flex h-full w-[min(85vw,20rem)] shrink-0 snap-center flex-col rounded-2xl border border-border bg-surface-secondary/70 sm:w-72',
        isOver && 'ring-2 ring-accent/40',
      )}
    >
      <header className="p-3 pb-2">
        <div className={cn('mb-3 h-1 rounded-full', STATUS_COLORS[status].header)} />
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-foreground">{STATUS_LABELS[status]}</h2>
          <span className="rounded-lg bg-surface px-2 py-0.5 text-xs font-medium tabular-nums text-muted shadow-sm">
            {jobs.length}
          </span>
        </div>
      </header>

      <div ref={setNodeRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-3 pb-3">
        <SortableContext items={jobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onOpen={onOpen} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </SortableContext>

        {jobs.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border px-3 py-8 text-center text-xs text-muted">
            Arraste uma vaga para cá
          </div>
        ) : null}
      </div>
    </section>
  );
}
