import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DtoTask } from '../entity-task/entity-task.component';
import { TasksService } from '../tasks.service';

@Component({
	selector: 'app-list-entity-task',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './list-entity-task.component.html',
	styleUrl: './list-entity-task.component.css'
})
export class ListEntityTaskComponent {

	readonly baseUrl = 'https://angular.dev/assets/tutorials/common';

	listDtoTask!: DtoTask[];

	tasksService: TasksService = inject(TasksService);

	constructor() {
		this.listDtoTask = this.tasksService.findAll();
	}

}
