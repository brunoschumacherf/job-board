import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Board } from '../../components/Board/Board';
import { StatusChart } from '../../components/Charts/StatusChart';
import { ConfirmDialog } from '../../components/ConfirmDialog/ConfirmDialog';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { Filters } from '../../components/Filters/Filters';
import { Header } from '../../components/Header/Header';
import { JobDetailModal } from '../../components/JobCard/JobDetailModal';
import { JobForm } from '../../components/JobForm/JobForm';
import { Modal } from '../../components/Modal/Modal';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { BoardSkeleton, StatsSkeleton } from '../../components/Skeleton/Skeleton';
import { Stats } from '../../components/Stats/Stats';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';
import { useJobs } from '../../hooks/useJobs';
import type { Job } from '../../types/Job';
import { jobToExportable } from '../../utils/jobHelpers';
import { importJobsSchema, type JobFormValues } from '../../utils/schemas';

export function Dashboard() {
  const {
    jobs,
    jobsByStatus,
    stats,
    companies,
    loading,
    filters,
    updateFilters,
    resetFilters,
    createJob,
    updateJob,
    moveJob,
    removeJob,
    importJobs,
  } = useJobs();

  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [detailJob, setDetailJob] = useState<Job | null>(null);
  const [deletingJob, setDeletingJob] = useState<Job | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showChart, setShowChart] = useState(true);

  const openCreate = useCallback(() => {
    setEditingJob(null);
    setFormOpen(true);
  }, []);

  useKeyboardShortcut({ key: 'n', ctrlOrMeta: true }, openCreate);

  const openEdit = (job: Job) => {
    setDetailJob(null);
    setEditingJob(job);
    setFormOpen(true);
  };

  const handleSubmit = async (values: JobFormValues) => {
    const payload = {
      ...values,
      dataCandidatura: values.dataCandidatura || null,
      link: values.link || '',
    };

    if (editingJob) {
      await updateJob(editingJob.id, payload);
    } else {
      await createJob({ ...payload, status: 'aplicar' });
    }

    setFormOpen(false);
    setEditingJob(null);
  };

  const handleDelete = async () => {
    if (!deletingJob) return;
    setDeleting(true);
    try {
      await removeJob(deletingJob.id);
      setDeletingJob(null);
      setDetailJob(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    const payload = jobs.map(jobToExportable);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `job-board-export-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('Exportação concluída');
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const jobsData = importJobsSchema.parse(parsed);
      await importJobs(
        jobsData.map((item) => ({
          ...item,
          status: item.status ?? 'aplicar',
          tags: item.tags ?? [],
          observacoes: item.observacoes ?? '',
          faixaSalarial: item.faixaSalarial ?? '',
          localizacao: item.localizacao ?? 'remoto',
          prioridade: item.prioridade ?? 'media',
          dataCandidatura: item.dataCandidatura ?? null,
          feedback: item.feedback ?? '',
          link: item.link ?? '',
          descricao: item.descricao ?? '',
        })),
      );
    } catch (err) {
      console.error(err);
      toast.error('Arquivo JSON inválido');
    }
  };

  return (
    <div className="min-h-screen bg-app text-foreground">
      <Header onCreate={openCreate} onExport={handleExport} onImport={handleImport} />

      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6">
        {loading ? (
          <>
            <StatsSkeleton />
            <BoardSkeleton />
          </>
        ) : (
          <>
            <Stats {...stats} />

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <SearchBar value={filters.search} onChange={(search) => updateFilters({ search })} />
              <Filters
                filters={filters}
                companies={companies}
                onChange={updateFilters}
                onReset={resetFilters}
              />
              <button
                type="button"
                onClick={() => setShowChart((v) => !v)}
                className="rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-muted-bg hover:text-foreground lg:ml-auto"
              >
                {showChart ? 'Ocultar gráfico' : 'Mostrar gráfico'}
              </button>
            </div>

            {showChart ? <StatusChart jobs={jobs} /> : null}

            {jobs.length === 0 ? (
              <EmptyState
                title="Nenhuma vaga ainda"
                description="Comece cadastrando a primeira oportunidade. Use o botão Nova vaga ou o atalho Ctrl+N."
                actionLabel="Nova vaga"
                onAction={openCreate}
              />
            ) : (
              <Board
                jobsByStatus={jobsByStatus}
                onMoveJob={moveJob}
                onOpen={setDetailJob}
                onEdit={openEdit}
                onDelete={setDeletingJob}
              />
            )}
          </>
        )}
      </main>

      <Modal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingJob(null);
        }}
        title={editingJob ? 'Editar vaga' : 'Nova vaga'}
        size="xl"
      >
        <JobForm
          job={editingJob}
          onSubmit={handleSubmit}
          onCancel={() => {
            setFormOpen(false);
            setEditingJob(null);
          }}
          submitLabel={editingJob ? 'Salvar alterações' : 'Criar vaga'}
        />
      </Modal>

      <JobDetailModal
        job={detailJob}
        open={Boolean(detailJob)}
        onClose={() => setDetailJob(null)}
        onEdit={openEdit}
        onDelete={(job) => setDeletingJob(job)}
      />

      <ConfirmDialog
        open={Boolean(deletingJob)}
        title="Excluir vaga"
        description={`Tem certeza que deseja excluir "${deletingJob?.titulo}"? Esta ação não pode ser desfeita.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingJob(null)}
      />
    </div>
  );
}
