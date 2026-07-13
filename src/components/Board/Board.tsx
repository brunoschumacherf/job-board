import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { Job, JobStatus } from '../../types/Job';
import { JOB_STATUSES } from '../../types/Job';
import { Column } from '../Column/Column';
import { JobCard } from '../JobCard/JobCard';

interface BoardProps {
  jobsByStatus: Record<JobStatus, Job[]>;
  onMoveJob: (id: string, status: JobStatus) => Promise<void>;
  onOpen: (job: Job) => void;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
}

function isStatus(id: string | number): id is JobStatus {
  return JOB_STATUSES.includes(id as JobStatus);
}

export function Board({ jobsByStatus, onMoveJob, onOpen, onEdit, onDelete }: BoardProps) {
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [localBoard, setLocalBoard] = useState<Record<JobStatus, Job[]> | null>(null);

  const board = localBoard ?? jobsByStatus;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const jobLookup = useMemo(() => {
    const map = new Map<string, Job>();
    for (const status of JOB_STATUSES) {
      for (const job of board[status]) {
        map.set(job.id, job);
      }
    }
    return map;
  }, [board]);

  const findContainer = (id: string | number): JobStatus | null => {
    if (isStatus(id)) return id;
    for (const status of JOB_STATUSES) {
      if (board[status].some((job) => job.id === id)) return status;
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const job = jobLookup.get(String(event.active.id));
    setActiveJob(job ?? null);
    setLocalBoard(jobsByStatus);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !localBoard) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setLocalBoard((prev) => {
      if (!prev) return prev;
      const activeItems = [...prev[activeContainer]];
      const overItems = [...prev[overContainer]];
      const activeIndex = activeItems.findIndex((j) => j.id === activeId);
      if (activeIndex < 0) return prev;

      const [moved] = activeItems.splice(activeIndex, 1);
      const updatedMoved = { ...moved, status: overContainer };

      const overIndex = isStatus(overId)
        ? overItems.length
        : overItems.findIndex((j) => j.id === overId);

      overItems.splice(overIndex >= 0 ? overIndex : overItems.length, 0, updatedMoved);

      return {
        ...prev,
        [activeContainer]: activeItems,
        [overContainer]: overItems,
      };
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveJob(null);

    if (!over || !localBoard) {
      setLocalBoard(null);
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) {
      setLocalBoard(null);
      return;
    }

    if (activeContainer === overContainer) {
      const items = localBoard[activeContainer];
      const oldIndex = items.findIndex((j) => j.id === activeId);
      const newIndex = items.findIndex((j) => j.id === overId);
      if (oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex) {
        setLocalBoard({
          ...localBoard,
          [activeContainer]: arrayMove(items, oldIndex, newIndex),
        });
      }
    }

    const originalStatus =
      JOB_STATUSES.find((status) => jobsByStatus[status].some((j) => j.id === activeId)) ?? null;

    setLocalBoard(null);

    if (originalStatus && overContainer !== originalStatus) {
      await onMoveJob(activeId, overContainer);
    }
  };

  const handleDragCancel = () => {
    setActiveJob(null);
    setLocalBoard(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth md:snap-none">
        {JOB_STATUSES.map((status) => (
          <Column
            key={status}
            status={status}
            jobs={board[status]}
            onOpen={onOpen}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <DragOverlay>
        {activeJob ? (
          <div className="w-72">
            <JobCard
              job={activeJob}
              onOpen={() => undefined}
              onEdit={() => undefined}
              onDelete={() => undefined}
              isDraggingOverlay
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
