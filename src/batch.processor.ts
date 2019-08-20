import { createTask, TaskInterface, TaskFactoryOptions } from '@ebottacin/ngx-translate-extract';

import { container } from '@ebottacin/ngx-translate-extract';
import { updateContainer } from './ioc/inversify.config.kml';

export function newTask(input: string[], output: string[]): TaskInterface {

	const options: TaskFactoryOptions = new TaskFactoryOptions();
	options.format = 'kml';

	return createTask(input, output, options);
}

export function setupIoC() {
	if (container !== undefined) {
		updateContainer();
	}
}
