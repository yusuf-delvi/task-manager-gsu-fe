import { Task, TaskPriority, TaskStatus } from '@/types';
import { useApiClient } from '@/hooks/api';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { FormEvent } from 'react';

interface Props {
	open: boolean;
	taskStatus: TaskStatus;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleAddTask: (task: Task) => void;
}

function AddTaskDialog({ open, setOpen, taskStatus, handleAddTask }: Props) {
	const { apiCall } = useApiClient();

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const title = formData.get('title');
		const description = formData.get('description');
		const dueDate = formData.get('dueDate');
		const priority = formData.get('priority');

		try {
			const createdRes = await apiCall(`task`, 'POST', {
				title,
				description,
				dueDate,
				priority,
				status: taskStatus,
			});

			if (!createdRes) throw new Error('Unable to create task');

			handleAddTask(createdRes.data as Task);
			setOpen(false);
		} catch (error) {
			console.error(error);
			setOpen(false);
		}
	}

	async function handleReset(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		formData.set('title', '');
		formData.set('description', '');
		formData.set('dueDate', '');
		formData.set('priority', 'LOW');

		setOpen(false);
	}

	return (
		<Dialog open={open} onClose={setOpen} className='relative z-10'>
			<DialogBackdrop
				transition
				className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in'
			/>

			<div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
				<div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
					<DialogPanel
						transition
						className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95'
					>
						<div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
							<div className='mt-3 text-center sm:mt-0 sm:text-left'>
								<form onSubmit={handleSubmit} onReset={handleReset}>
									<div className=''>
										<h2 className='text-base font-semibold leading-7 text-gray-900'>
											Create Task
										</h2>

										<div className='grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-6'>
											<div className='sm:col-span-6'>
												<div className='mt-2'>
													<input
														id='title'
														name='title'
														type='text'
														title='Task name'
														placeholder='Name'
														required
														className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
													/>
												</div>
											</div>

											<div className='sm:col-span-3'>
												<div className='mt-2'>
													<select
														id='priority'
														name='priority'
														title='Priority'
														required
														className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6'
													>
														<option value={TaskPriority.LOW}>LOW</option>
														<option value={TaskPriority.MEDIUM}>MEDIUM</option>
														<option value={TaskPriority.HIGH}>HIGH</option>
													</select>
												</div>
											</div>

											<div className='sm:col-span-3'>
												<div className='mt-2'>
													<input
														id='dueDate'
														name='dueDate'
														type='date'
														title='Due Date'
														required
														className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
													/>
												</div>
											</div>

											<div className='col-span-full'>
												<div className='mt-2'>
													<textarea
														id='description'
														name='description'
														title='Desctiption'
														rows={2}
														placeholder='Description'
														className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
														defaultValue={''}
													/>
												</div>
											</div>
										</div>
									</div>

									<div className='mt-6 flex items-center justify-end gap-x-6'>
										<button
											type='reset'
											className='text-sm font-semibold leading-6 text-gray-900'
										>
											Cancel
										</button>
										<button
											type='submit'
											className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
										>
											Create
										</button>
									</div>
								</form>
							</div>
						</div>
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	);
}

export default AddTaskDialog;
