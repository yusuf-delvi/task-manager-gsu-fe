import React, { useEffect, useState } from 'react';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import {
	closestCorners,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
	DragOverEvent,
	useDroppable,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import TaskDialog from './TaskDialog';
import { Task, TaskColumns, TaskStatus } from '@/types';
import TaskCard from './TaskCard';
import { useApiClient } from '@/hooks/api';

function Kanban() {
	const { apiCall } = useApiClient();
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [tasks, setTasks] = useState<TaskColumns>({});
	const [addingTaskStatus, setAddingTaskStatus] = useState<TaskStatus>(
		TaskStatus.PENDING
	);
	const { setNodeRef: setNodeRefPending } = useDroppable({
		id: TaskStatus.PENDING,
	});
	const { setNodeRef: setNodeRefInProgress } = useDroppable({
		id: TaskStatus.INPROGRESS,
	});
	const { setNodeRef: setNodeRefDone } = useDroppable({ id: TaskStatus.DONE });

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	function handleAddTask(task: Task) {
		const updatedTasksArr = [task, ...tasks[task.status].tasks];
		setTasks({
			...tasks,
			[task.status]: { ...tasks[task.status], tasks: updatedTasksArr },
		});
	}

	const fetchData = async () => {
		try {
			setIsLoading(true);

			const result = await apiCall(`task`, 'GET');

			const tasksData: TaskColumns = {
				[TaskStatus.PENDING]: {
					id: TaskStatus.PENDING,
					tasks: [],
				},
				[TaskStatus.INPROGRESS]: {
					id: TaskStatus.INPROGRESS,
					tasks: [],
				},
				[TaskStatus.DONE]: {
					id: TaskStatus.DONE,
					tasks: [],
				},
			};

			result.data?.forEach((task: Task) => {
				tasksData[task.status].tasks.push(task);
			});

			setTasks(tasksData);
		} catch (err) {
			console.log(err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	function onAddTask(taskStatus: TaskStatus) {
		setAddingTaskStatus(taskStatus);
		setOpen(true);
	}

	if (isLoading) {
		return <div>Loading...</div>;
	}

	const pendingTasks: Task[] = tasks[TaskStatus.PENDING].tasks;
	const inprogressTasks: Task[] = tasks[TaskStatus.INPROGRESS].tasks;
	const doneTasks: Task[] = tasks[TaskStatus.DONE].tasks;

	const findColumn = (unique: string | null) => {
		if (!unique) {
			return null;
		}

		if (tasks[unique]) {
			return tasks[unique] ?? null;
		}

		const id = String(unique);

		let columnId: string | null = null;

		Object.keys(tasks).forEach((columnKey) => {
			const isFound = tasks[columnKey].tasks.find((tsk) => tsk._id === unique);

			if (isFound) {
				columnId = columnKey;
			}
		});

		if (!columnId) return null;

		return tasks[columnId] ?? null;
	};

	function handleDragOver(event: DragOverEvent) {
		const { active, over, delta } = event;
		const activeId = String(active.id);
		const overId = over ? String(over.id) : null;
		const activeColumn = findColumn(activeId);
		const overColumn = findColumn(overId);

		if (!activeColumn || !overColumn || activeColumn === overColumn) {
			return null;
		}

		setTasks((prevState) => {
			const activeItems = activeColumn.tasks;
			const overItems = overColumn.tasks;
			const activeIndex = activeItems.findIndex((i) => i._id === activeId);
			const overIndex = overItems.findIndex((i) => i._id === overId);
			const newIndex = () => {
				const putOnBelowLastItem =
					overIndex === overItems.length - 1 && delta.y > 0;
				const modifier = putOnBelowLastItem ? 1 : 0;
				return overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
			};

			Object.keys(prevState).forEach((columnId) => {
				if (columnId === activeColumn.id) {
					prevState[columnId].tasks = activeItems.filter(
						(i) => i._id !== activeId
					);
				} else if (columnId === overColumn.id) {
					prevState[columnId].tasks = [
						...overItems.slice(0, newIndex()),
						activeItems[activeIndex],
						...overItems.slice(newIndex(), overItems.length),
					];
				}
			});

			return { ...prevState };
		});
	}

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		const activeId = String(active.id);
		const overId = over ? String(over.id) : null;
		const activeColumn = findColumn(activeId);
		const overColumn = findColumn(overId);

		if (!activeColumn || !overColumn || activeColumn !== overColumn) {
			return null;
		}

		const activeIndex = activeColumn.tasks.findIndex((i) => i._id === activeId);
		const overIndex = overColumn.tasks.findIndex((i) => i._id === overId);

		try {
			await apiCall('task/updateStatus', 'PUT', {
				id: activeId,
				status: activeColumn.id,
			});
		} catch (error) {
			console.error(error);
		}

		if (activeIndex !== overIndex) {
			setTasks((prevState) => {
				Object.keys(prevState).forEach((columnId) => {
					if (columnId === activeColumn.id) {
						prevState[columnId].tasks = arrayMove(
							overColumn.tasks,
							activeIndex,
							overIndex
						);
					}
				});

				return { ...prevState };
			});
		}
	}

	return (
		<DndContext
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
			sensors={sensors}
			collisionDetection={closestCorners}
		>
			<div className='container mt-5 mx-auto p-4'>
				<TaskDialog
					open={open}
					setOpen={setOpen}
					taskStatus={addingTaskStatus}
					handleAddTask={handleAddTask}
				/>
				<div className='overflow-x-auto'>
					<div className='grid grid-flow-col gap-4 md:grid-cols-2 lg:grid-cols-3'>
						<div className='min-w-[300px]'>
							<div
								className='flex justify-between mb-4 px-6 py-3 rounded-lg'
								style={{ background: '#EBE5FF' }}
							>
								<h2 className='text-lg font-semibold'>To - Do</h2>
								<button
									onClick={() => onAddTask(TaskStatus.PENDING)}
									className='flex items-center justify-center rounded-full w-7 h-7'
									style={{ background: '#F4F2FF' }}
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 24 24'
										stroke='#000'
										className='w-4 h-4'
										strokeWidth={2}
									>
										<path
											fillRule='evenodd'
											d='M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z'
											clipRule='evenodd'
										/>
									</svg>
								</button>
							</div>
							<SortableContext
								id={TaskStatus.PENDING}
								items={pendingTasks.map((tsk) => tsk._id)}
								strategy={rectSortingStrategy}
							>
								<div ref={setNodeRefPending}>
									{pendingTasks.map((task) => (
										<TaskCard key={task._id} {...task} />
									))}
								</div>
							</SortableContext>
						</div>

						<div className='min-w-[300px]'>
							<div
								className='flex justify-between mb-4 px-6 py-3 rounded-lg'
								style={{ background: '#DFF4F9' }}
							>
								<h2 className='text-lg font-semibold'>In Progress</h2>
								<button
									onClick={() => onAddTask(TaskStatus.INPROGRESS)}
									className='flex items-center justify-center rounded-full w-7 h-7'
									style={{ background: '#EFFAFB' }}
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 24 24'
										stroke='#000'
										className='w-4 h-4'
										strokeWidth={2}
									>
										<path
											fillRule='evenodd'
											d='M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z'
											clipRule='evenodd'
										/>
									</svg>
								</button>
							</div>
							<SortableContext
								id={TaskStatus.INPROGRESS}
								items={inprogressTasks.map((tsk) => tsk._id)}
								strategy={rectSortingStrategy}
							>
								<div ref={setNodeRefInProgress}>
									{inprogressTasks.map((task) => (
										<TaskCard key={task._id} {...task} />
									))}
								</div>
							</SortableContext>
						</div>

						<div className='min-w-[300px]'>
							<div
								className='flex justify-between mb-4 px-6 py-3 rounded-lg'
								style={{ background: '#E3F6D9' }}
							>
								<h2 className='text-lg font-semibold'>Done</h2>
								<button
									onClick={() => onAddTask(TaskStatus.DONE)}
									className='flex items-center justify-center rounded-full w-7 h-7'
									style={{ background: '#F1FBEC' }}
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 24 24'
										stroke='#000'
										className='w-4 h-4'
										strokeWidth={2}
									>
										<path
											fillRule='evenodd'
											d='M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z'
											clipRule='evenodd'
										/>
									</svg>
								</button>
							</div>
							<SortableContext
								id={TaskStatus.DONE}
								items={doneTasks.map((tsk) => tsk._id)}
								strategy={rectSortingStrategy}
							>
								<div ref={setNodeRefDone}>
									{doneTasks.map((task) => (
										<TaskCard key={task._id} {...task} />
									))}
								</div>
							</SortableContext>
						</div>
					</div>
				</div>
			</div>
		</DndContext>
	);
}

export default Kanban;
