import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import type { CreateJobData, Job, JobStatus, UpdateJobData } from '../types/Job';
import { COLLECTION_JOBS } from '../utils/constants';
import { db } from './firebase';

function mapJobDoc(id: string, data: Record<string, unknown>): Job {
  return {
    id,
    titulo: String(data.titulo ?? ''),
    empresa: String(data.empresa ?? ''),
    link: String(data.link ?? ''),
    descricao: String(data.descricao ?? ''),
    status: (data.status as JobStatus) ?? 'aplicar',
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    observacoes: String(data.observacoes ?? ''),
    faixaSalarial: String(data.faixaSalarial ?? ''),
    localizacao: (data.localizacao as Job['localizacao']) ?? 'remoto',
    prioridade: (data.prioridade as Job['prioridade']) ?? 'media',
    dataCandidatura: (data.dataCandidatura as string | null) ?? null,
    feedback: String(data.feedback ?? ''),
    createdAt: data.createdAt as Job['createdAt'],
    updatedAt: data.updatedAt as Job['updatedAt'],
  };
}

export async function getJobs(): Promise<Job[]> {
  const jobsQuery = query(collection(db, COLLECTION_JOBS), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(jobsQuery);
  return snapshot.docs.map((document) => mapJobDoc(document.id, document.data()));
}

export function subscribeToJobs(
  onData: (jobs: Job[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const jobsQuery = query(collection(db, COLLECTION_JOBS), orderBy('createdAt', 'desc'));

  return onSnapshot(
    jobsQuery,
    (snapshot) => {
      const jobs = snapshot.docs.map((document) => mapJobDoc(document.id, document.data()));
      onData(jobs);
    },
    (error) => {
      onError?.(error);
    },
  );
}

export async function createJob(data: CreateJobData): Promise<string> {
  const payload = {
    titulo: data.titulo,
    empresa: data.empresa,
    link: data.link,
    descricao: data.descricao,
    status: data.status ?? 'aplicar',
    tags: data.tags ?? [],
    observacoes: data.observacoes ?? '',
    faixaSalarial: data.faixaSalarial ?? '',
    localizacao: data.localizacao ?? 'remoto',
    prioridade: data.prioridade ?? 'media',
    dataCandidatura: data.dataCandidatura ?? null,
    feedback: data.feedback ?? '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, COLLECTION_JOBS), payload);
  return ref.id;
}

export async function updateJob(id: string, data: UpdateJobData): Promise<void> {
  const ref = doc(db, COLLECTION_JOBS, id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function updateJobStatus(id: string, status: JobStatus): Promise<void> {
  await updateJob(id, { status });
}

export async function deleteJob(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_JOBS, id));
}

export async function importJobs(jobs: CreateJobData[]): Promise<number> {
  let count = 0;
  for (const job of jobs) {
    await createJob(job);
    count += 1;
  }
  return count;
}
