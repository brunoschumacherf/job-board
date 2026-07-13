import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { CreateJobData, Job, JobFilters, JobStatus, UpdateJobData } from '../types/Job';
import * as jobsService from '../services/jobs';
import {
  filterJobs,
  getJobStats,
  getUniqueCompanies,
  groupJobsByStatus,
} from '../utils/jobHelpers';

const defaultFilters: JobFilters = {
  search: '',
  empresa: '',
  status: 'all',
  sortBy: 'updatedAt',
};

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);

  useEffect(() => {
    const unsubscribe = jobsService.subscribeToJobs(
      (data) => {
        setJobs(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(err);
        setError(err.message || 'Erro ao carregar vagas');
        setLoading(false);
        toast.error('Não foi possível carregar as vagas');
      },
    );

    return unsubscribe;
  }, []);

  const filteredJobs = useMemo(() => filterJobs(jobs, filters), [jobs, filters]);
  const jobsByStatus = useMemo(() => groupJobsByStatus(filteredJobs), [filteredJobs]);
  const stats = useMemo(() => getJobStats(jobs), [jobs]);
  const companies = useMemo(() => getUniqueCompanies(jobs), [jobs]);

  const createJob = useCallback(async (data: CreateJobData) => {
    try {
      await jobsService.createJob(data);
      toast.success('Vaga criada com sucesso');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao criar vaga');
      throw err;
    }
  }, []);

  const updateJob = useCallback(async (id: string, data: UpdateJobData) => {
    try {
      await jobsService.updateJob(id, data);
      toast.success('Vaga atualizada');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao atualizar vaga');
      throw err;
    }
  }, []);

  const moveJob = useCallback(async (id: string, status: JobStatus) => {
    try {
      await jobsService.updateJobStatus(id, status);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao mover vaga');
      throw err;
    }
  }, []);

  const removeJob = useCallback(async (id: string) => {
    try {
      await jobsService.deleteJob(id);
      toast.success('Vaga excluída');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir vaga');
      throw err;
    }
  }, []);

  const importJobs = useCallback(async (items: CreateJobData[]) => {
    try {
      const count = await jobsService.importJobs(items);
      toast.success(`${count} vaga(s) importada(s)`);
      return count;
    } catch (err) {
      console.error(err);
      toast.error('Erro ao importar vagas');
      throw err;
    }
  }, []);

  const updateFilters = useCallback((partial: Partial<JobFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return {
    jobs,
    filteredJobs,
    jobsByStatus,
    stats,
    companies,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    createJob,
    updateJob,
    moveJob,
    removeJob,
    importJobs,
  };
}
