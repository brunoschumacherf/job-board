import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { Job } from '../../types/Job';
import { JOB_STATUSES } from '../../types/Job';
import { STATUS_COLORS, STATUS_LABELS } from '../../utils/constants';

interface StatusChartProps {
  jobs: Job[];
}

export function StatusChart({ jobs }: StatusChartProps) {
  const data = JOB_STATUSES.map((status) => ({
    name: STATUS_LABELS[status],
    value: jobs.filter((j) => j.status === status).length,
    color: STATUS_COLORS[status].chart,
  })).filter((item) => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted">
        Sem dados para o gráfico
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Distribuição por status</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-foreground)',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
