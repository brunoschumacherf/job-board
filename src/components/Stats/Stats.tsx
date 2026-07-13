import { BriefcaseBusiness, CheckCircle2, ClipboardList, Send, XCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatsProps {
  total: number;
  aplicadas: number;
  emProcesso: number;
  aprovadas: number;
  reprovadas: number;
}

const cards = [
  {
    key: 'total',
    label: 'Total de vagas',
    icon: BriefcaseBusiness,
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-950/40',
  },
  {
    key: 'aplicadas',
    label: 'Aplicadas',
    icon: Send,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
  },
  {
    key: 'emProcesso',
    label: 'Em processo',
    icon: ClipboardList,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
  },
  {
    key: 'aprovadas',
    label: 'Aprovadas',
    icon: CheckCircle2,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
  {
    key: 'reprovadas',
    label: 'Reprovadas',
    icon: XCircle,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
  },
] as const;

export function Stats(props: StatsProps) {
  const values: Record<(typeof cards)[number]['key'], number> = {
    total: props.total,
    aplicadas: props.aplicadas,
    emProcesso: props.emProcesso,
    aprovadas: props.aprovadas,
    reprovadas: props.reprovadas,
  };

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="rounded-2xl border border-border bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  {card.label}
                </p>
                <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
                  {values[card.key]}
                </p>
              </div>
              <div className={cn('rounded-xl p-2.5', card.bg, card.color)}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
