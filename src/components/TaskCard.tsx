import { Task, TaskPriority } from '@/types';
import moment from 'moment';
import TaskDialog from './TaskDialog';
import { useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

const TaskCard: React.FC<Task> = (propTask) => {
	const [open, setOpen] = useState(false);
	const [task, setTask] = useState<Task>(propTask);
	const { attributes, listeners, setNodeRef, transform } = useSortable({
		id: task._id,
	});

	return (
		<>
			<TaskDialog
				open={open}
				setOpen={setOpen}
				taskStatus={task.status}
				handleAddTask={(updatedTask: Task) => {
					setTask({ ...task, ...updatedTask });
				}}
				task={task}
				isUpdate
			/>
			<div
				ref={setNodeRef}
				{...attributes}
				{...listeners}
				style={{ transform: CSS.Transform.toString(transform) }}
			>
				<div
					className='bg-white shadow-md rounded-lg p-4 mb-4 lg:cursor-move sm:cursor-pointer'
					onClick={() => {
						setOpen(true);
					}}
				>
					<h3 className='font-semibold text-lg'>{task.title}</h3>
					<p className='text-gray-700 mb-2'>{task.description}</p>
					<div className='flex items-center justify-between mb-2'>
						<span
							className={`px-2 py-1 rounded-full text-xs font-bold ${
								task.priority === TaskPriority.HIGH
									? 'bg-red-100 text-red-500'
									: task.priority === TaskPriority.MEDIUM
									? 'bg-yellow-100 text-yellow-500'
									: 'bg-green-100 text-green-500'
							}`}
						>
							{task.priority}
						</span>
						<span className='text-xs text-gray-400'>
							{moment(task.dueDate).format('DD MMMM YY')}
						</span>
					</div>
				</div>
			</div>
		</>
	);
};

export default TaskCard;
