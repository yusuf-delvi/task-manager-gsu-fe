import React, { useEffect, useState } from 'react';
import TaskDialog from './TaskDialog';
import { Task, TaskStatus } from '@/types';
import TaskCard from './TaskCard';
import { useApiClient } from '@/hooks/api';

function Kanban() {
	const { apiCall } = useApiClient();
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState<Task[]>([]);
	const [addingTaskStatus, setAddingTaskStatus] = useState<TaskStatus>(
		TaskStatus.PENDING
	);

	function handleAddTask(task: Task) {
		setData([task, ...data]);
	}

	const fetchData = async () => {
		try {
			setIsLoading(true);

			const result = await apiCall(`task`, 'GET');

			setData(result.data as []);
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

	return (
		<div className='container mt-5 mx-auto p-4'>
			<TaskDialog
				open={open}
				setOpen={setOpen}
				taskStatus={addingTaskStatus}
				handleAddTask={handleAddTask}
			/>
			<div className='grid grid-cols-3 gap-4'>
				<div>
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
					{data
						.filter((tsk) => tsk.status === TaskStatus.PENDING)
						.map((task) => (
							<TaskCard key={task._id} {...task} />
						))}
				</div>

				<div>
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
					{data
						.filter((tsk) => tsk.status === TaskStatus.INPROGRESS)
						.map((task) => (
							<TaskCard key={task._id} {...task} />
						))}
				</div>

				<div>
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
					{data
						.filter((tsk) => tsk.status === TaskStatus.DONE)
						.map((task) => (
							<TaskCard key={task._id} {...task} />
						))}
				</div>
			</div>
		</div>
	);
}

export default Kanban;
