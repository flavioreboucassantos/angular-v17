import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from '../tasks.service';

export interface DtoTask {
	idTask: number;
	rawData: string;
	highlighted: boolean;
}

@Component({
	selector: 'app-entity-task',
	standalone: true,
	imports: [],
	templateUrl: './entity-task.component.html',
	styleUrl: './entity-task.component.css'
})
export class EntityTaskComponent {

	route: ActivatedRoute = inject(ActivatedRoute);
	tasksService: TasksService = inject(TasksService);

	dtoTask: DtoTask | undefined;

	constructor() {
		this.dtoTask = this.tasksService.findById(Number(this.route.snapshot.params['id']));
	}

}
