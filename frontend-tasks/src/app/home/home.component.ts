import { Component, Inject, inject } from '@angular/core';
import { FormDataComponent, EntityData } from '../form-data/form-data.component'
import { ListDataComponent } from '../list-data/list-data.component'
import { TasksService } from '../tasks.service';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [FormDataComponent, ListDataComponent],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css'
})
export class HomeComponent {

	readonly baseUrl = 'https://angular.dev/assets/tutorials/common';

	listEntityData!: EntityData[];

	tasksService: TasksService = inject(TasksService);

	constructor() {
		this.listEntityData = this.tasksService.findAll();
	}



}
