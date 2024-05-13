import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DtoArea } from '../entity-area/entity-area.component';
import { AreaService } from '../area.service';

@Component({
	selector: 'app-list-entity-area',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './list-entity-area.component.html',
	styleUrl: './list-entity-area.component.css'
})
export class ListEntityAreaComponent {

	readonly baseUrl = 'https://angular.dev/assets/tutorials/common';

	listDtoArea!: DtoArea[];

	areaService: AreaService = inject(AreaService);

	constructor() {
		this.listDtoArea = this.areaService.findAll();
	}

}
