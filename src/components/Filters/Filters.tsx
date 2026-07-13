import { ArrowUpDown, Building2, Filter } from 'lucide-react';
import type { JobFilters, JobStatus, SortOption } from '../../types/Job';
import { JOB_STATUSES } from '../../types/Job';
import { STATUS_LABELS } from '../../utils/constants';

interface FiltersProps {
  filters: JobFilters;
  companies: string[];
  onChange: (partial: Partial<JobFilters>) => void;
  onReset: () => void;
}

export function Filters({ filters, companies, onChange, onReset }: FiltersProps) {
  const hasActive =
    Boolean(filters.empresa) || filters.status !== 'all' || filters.sortBy !== 'updatedAt';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Building2 className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
        <select
          value={filters.empresa}
          onChange={(e) => onChange({ empresa: e.target.value })}
          className="appearance-none rounded-xl border border-border bg-surface py-2.5 pr-8 pl-9 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        >
          <option value="">Todas as empresas</option>
          {companies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <Filter className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
        <select
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value as JobStatus | 'all' })}
          className="appearance-none rounded-xl border border-border bg-surface py-2.5 pr-8 pl-9 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        >
          <option value="all">Todos os status</option>
          {JOB_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <ArrowUpDown className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
        <select
          value={filters.sortBy}
          onChange={(e) => onChange({ sortBy: e.target.value as SortOption })}
          className="appearance-none rounded-xl border border-border bg-surface py-2.5 pr-8 pl-9 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        >
          <option value="updatedAt">Ordenar por atualização</option>
          <option value="createdAt">Ordenar por criação</option>
        </select>
      </div>

      {hasActive ? (
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl px-3 py-2 text-sm font-medium text-muted transition hover:bg-muted-bg hover:text-foreground"
        >
          Limpar filtros
        </button>
      ) : null}
    </div>
  );
}
