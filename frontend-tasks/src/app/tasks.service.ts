import { Injectable } from '@angular/core';
import { DtoTask } from './entity-task/entity-task.component';

@Injectable({
	providedIn: 'root'
})
export class TasksService {

	constructor() { }

	listDtoTask: DtoTask[] = [{
		idTask: 1,
		rawData: 'my text 1',
		highlighted: false
	}, {
		idTask: 2,
		rawData: 'my text 2',
		highlighted: true
	}, {
		idTask: 3,
		rawData: 'my text 3',
		highlighted: false
	}, {
		idTask: 4,
		rawData: 'my text 4',
		highlighted: true
	}];

	findAll(): DtoTask[] {
		return this.listDtoTask;
	}
	
	findById(idTask: number): DtoTask | undefined {
		return this.listDtoTask.find((dtoTask) => dtoTask.idTask === idTask);
	}
}
