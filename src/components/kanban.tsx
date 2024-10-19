import React, { useState } from 'react';
import TaskDialog from './TaskDialog';
import { Task, TaskPriority, TaskStatus } from '@/types';
import TaskCard from './TaskCard';

const tasks: Task[] = [
	{
		_id: '1',
		title: 'Customer Journey Mapping',
		description: 'Mapping the customer journey for Kidszone.',
		priority: TaskPriority.MEDIUM,
		dueDate: new Date(),
		status: TaskStatus.PENDING,
	},
	{
		_id: '2',
		title: 'UI Component Modification',
		description: 'Micro interactions, Loading and Progress.',
		priority: TaskPriority.MEDIUM,
		dueDate: new Date(),
		status: TaskStatus.PENDING,
	},
	{
		_id: '3',
		title: 'Database Customization',
		description: "Customizing Uber's database for internal system.",
		priority: TaskPriority.MEDIUM,
		dueDate: new Date(),
		status: TaskStatus.INPROGRESS,
	},
	{
		_id: '4',
		title: 'Fix Interior Planning',
		description: 'Fix layout and 3D modeling for Hotel Nice.',
		priority: TaskPriority.LOW,
		dueDate: new Date(),
		status: TaskStatus.INPROGRESS,
	},
	{
		_id: '5',
		title: 'Redesign WordPress Website',
		description: 'Redesign the website for better usability.',
		priority: TaskPriority.HIGH,
		dueDate: new Date(),
		status: TaskStatus.DONE,
	},
	{
		_id: '6',
		title: 'Facebook Ads Campaign',
		description: 'Managing Facebook Ads campaign for Plantify.',
		priority: TaskPriority.MEDIUM,
		dueDate: new Date(),
		status: TaskStatus.DONE,
	},
];

function Kanban() {
	const [open, setOpen] = useState(false);
	const [addingTaskStatus, setAddingTaskStatus] = useState<TaskStatus>(
		TaskStatus.PENDING
	);

	function onAddTask(taskStatus: TaskStatus) {
		setAddingTaskStatus(taskStatus);
		setOpen(true);
	}

	return (
		<div className='container mt-5 mx-auto p-4'>
			<TaskDialog open={open} setOpen={setOpen} taskStatus={addingTaskStatus} />
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
					{tasks
						.filter((tsk) => tsk.status === TaskStatus.PENDING)
						.map((task, idx) => (
							<TaskCard key={idx} {...task} />
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
					{tasks
						.filter((tsk) => tsk.status === TaskStatus.INPROGRESS)
						.map((task, idx) => (
							<TaskCard key={idx} {...task} />
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
					{tasks
						.filter((tsk) => tsk.status === TaskStatus.DONE)
						.map((task, idx) => (
							<TaskCard key={idx} {...task} />
						))}
				</div>
			</div>
		</div>
	);
}

export default Kanban;
