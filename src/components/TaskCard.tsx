import { Task, TaskPriority } from '@/types';
import moment from 'moment';

const TaskCard: React.FC<Task> = ({
	title,
	description,
	priority,
	dueDate,
}) => {
	return (
		<div className='bg-white shadow-md rounded-lg p-4 mb-4'>
			<h3 className='font-semibold text-lg'>{title}</h3>
			<p className='text-gray-700 mb-2'>{description}</p>
			<div className='flex items-center justify-between mb-2'>
				<span
					className={`px-2 py-1 rounded-full text-xs font-bold ${
						priority === TaskPriority.HIGH
							? 'bg-red-100 text-red-500'
							: priority === TaskPriority.MEDIUM
							? 'bg-yellow-100 text-yellow-500'
							: 'bg-green-100 text-green-500'
					}`}
				>
					{priority}
				</span>
				<span className='text-xs text-gray-400'>
					{moment(dueDate).format('DD MMMM YY')}
				</span>
			</div>
		</div>
	);
};

export default TaskCard;
