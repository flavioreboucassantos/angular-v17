import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AreaService } from '../area.service';

export interface DtoArea {
	idArea: number;
	rawData: string;
	highlighted: boolean;
}

@Component({
	selector: 'app-entity-area',
	standalone: true,
	imports: [],
	templateUrl: './entity-area.component.html',
	styleUrl: './entity-area.component.css'
})
export class EntityAreaComponent {

	route: ActivatedRoute = inject(ActivatedRoute);
	areaService: AreaService = inject(AreaService);

	dtoArea: DtoArea | undefined;

	constructor() {
		this.dtoArea = this.areaService.findById(Number(this.route.snapshot.params['id']));
	}

}
