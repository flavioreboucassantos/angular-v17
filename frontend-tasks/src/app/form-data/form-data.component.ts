import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from '../tasks.service';

export interface EntityData {
	idEntityData: number;
	rawData: string;
	highlighted: boolean;
}

@Component({
	selector: 'app-form-data',
	standalone: true,
	imports: [],
	templateUrl: './form-data.component.html',
	styleUrl: './form-data.component.css'
})
export class FormDataComponent {

	route: ActivatedRoute = inject(ActivatedRoute);
	tasksService: TasksService = inject(TasksService);

	entityData: EntityData | undefined;

	constructor() {
		this.entityData = this.tasksService.findById(Number(this.route.snapshot.params['id']));
	}

}
