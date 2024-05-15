import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AreaService } from '../area.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

export interface DtoArea {
	idArea: number;
	rawData: string;
	uniqueData: string;
	highlighted: boolean;
}

@Component({
	selector: 'app-entity-area',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './entity-area.component.html',
	styleUrl: './entity-area.component.css'
})
export class EntityAreaComponent {

	activatedRoute: ActivatedRoute = inject(ActivatedRoute);
	areaService: AreaService = inject(AreaService);

	formArea = new FormGroup({
		rawData: new FormControl(''),
		uniqueData: new FormControl(''),
		highlighted: new FormControl(false)
	});

	dtoArea: DtoArea | undefined;

	constructor() {
		const idArea = parseInt(this.activatedRoute.snapshot.params['id'], 10);
		this.areaService.fetchFindById(idArea).then((dtoArea) => {
			if (dtoArea)
				this.formArea.setValue({
					rawData: dtoArea.rawData,
					uniqueData: dtoArea.uniqueData,
					highlighted: dtoArea?.highlighted
				});
		}
		);
	}

	createArea() {
		this.areaService.createArea(
			this.formArea.value.rawData ?? '',
			this.formArea.value.uniqueData ?? '',
			this.formArea.value.highlighted ?? false,
		);
	}

}
